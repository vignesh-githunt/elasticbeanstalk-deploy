const MUTATIONTIMEOUT = 4000

/**
 * Extracts a list of contacts from a search results page
 *
 * Algorithm
 * 1 - Request list of selectors for the current page, in order of priority to try
 * 2 - Test if the top priority selector matches every 300ms until the contact data is found or the page hasn't changed for MUTATIONTIMEOUT (implies the page has loaded)
 * 3 - Once 2 is satisfied try extracting the contact list from the page in order of selectors from top priority to lowest priority
 */
export default class ContactScrapingService {

  constructor(logger, contactScrapingSelectorFactory, contactsUpdatedCallback) {
    this.logger = logger
    this.contactScrapingSelectorFactory = contactScrapingSelectorFactory;
    this.lastPageMutationEvent = null
    this.contactsUpdatedCallback = contactsUpdatedCallback
  }

  async initialise() {

    this.logger.info('Initialising scraping');
    const pageSelectors = await this.contactScrapingSelectorFactory.getPageSelectors()
    if (!pageSelectors.length) {
      this.logger.error('No page selectors found, aborting')
      return
    } else {
      this.logger.info(`${pageSelectors.length} page selectors found`)
    }

    await this.waitForMutationsToCompleteOrFirstSelectorMatch(pageSelectors)
    const { contacts, pageSelector } = this.extractContactDetails(pageSelectors)
    if (!contacts.length) {
      this.logger.error('No contacts found')
      return
    }

    this.initialiseResultsMutationObserver(pageSelector)
    this.contactsUpdatedCallback(contacts)
  }

  /**
   * Create a mutation observer for the whole page so we can make a judgement on when the page has completed loading
   */
  initialiseDocumentMutationObserver() {
    this.logger.info('Initialising document mutation observer')
    this.lastPageMutationEvent = performance.now()
    const observer = new MutationObserver(this.handlePageMutation.bind(this))
    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * Create a mutation observer for the results container so when it changes we can respond to the new list of contacts
   * @param {*} pageSelector
   */
  initialiseResultsMutationObserver(pageSelector) {
    this.logger.info('Initialising results mutation observer')
    const observer = new MutationObserver(this.handleResultsMutation.bind(this, pageSelector))
    const resultsContainer = document.querySelector(pageSelector.searchResultsContainer)
    observer.observe(resultsContainer, { childList: true, subtree: true })
  }

  /**
   * Record when a page mutation occurred so we can track how long it's been since the page changed
   */
  handlePageMutation() {
    this.logger.info('Page mutation')
    this.lastPageMutationEvent = performance.now()
  }

  /**
   * If the results container experiences a mutation, extract the contact data and notify the callback
   * @param {*} pageSelector
   */
  handleResultsMutation(pageSelector) {
    const contacts = this.tryExtractContactDetails(pageSelector)
    this.contactsUpdatedCallback(contacts)
  }

  /**
   * Using a mutation observer, poll the page searching for contact data using the first page selector,
   * return if contact data has been found or the page load has completed, denoted by a page mutation not
   * occuring for a set period
   * @param {*} pageSelectors
   */
  async waitForMutationsToCompleteOrFirstSelectorMatch(pageSelectors) {

    this.initialiseDocumentMutationObserver()

    return new Promise(resolve => {
      const firstPageSelector = pageSelectors[0]
      const mutationEventTimer = setInterval(() => {
        if (this.testPageSelectorMatches(firstPageSelector) || performance.now() - this.lastPageMutationEvent > MUTATIONTIMEOUT) {
          clearInterval(mutationEventTimer);
          resolve()
        }
      }, 500)
    })
  }

  /**
   * Given a page selector, test to see if it returns 1 or more page elements that match the selector
   * @param {*} selector
   */
  testPageSelectorMatches(selector) {
    const matched = document.querySelectorAll(selector.searchResultsPattern).length > 0
    if (matched)
      this.logger.info(`Found contacts with selector ${selector.id}`)
    return matched
  }

  /**
   * Given a list of page selectors, try extracting contact data from the page in order
   * @param {*} pageSelectors
   */
  extractContactDetails(pageSelectors) {

    let contacts = []
    let pageSelector = null
    while (pageSelectors.length && !contacts.length) {
      pageSelector = pageSelectors.shift()
      contacts = this.tryExtractContactDetails(pageSelector)
    }

    return { contacts, pageSelector }
  }

  /**
   * Check the contact has all the required fields
   * @param {*} contact
   */
  validateContact(contact) {
    return !!contact.uid &&
            !!contact.link &&
            !!contact.url &&
            !!contact.name
  }

  /**
   * Given a page selector try and extract all the contacts on the page
   * @param {*} pageSelector
   */
  tryExtractContactDetails(pageSelector) {

    const contactsList = []
    const searchContainer = document.querySelector(pageSelector.searchResultsContainer)
    const searchResults = document.querySelectorAll(pageSelector.searchResultsPattern)
    if (!searchContainer || !searchResults.length) {
      this.logger.info(`Failed finding contacts with page selector ${pageSelector.id}`)
      return
    }

    searchResults.forEach(element => {
      const contact = {
        name: this.tryExtractName(element, pageSelector),
        uid: this.tryExtractId(element, pageSelector),
        link: this.tryExtractUrl(element, pageSelector),
        url: this.tryExtractUrl(element, pageSelector),
        headline: this.tryExtractHeadline(element, pageSelector),
        company: this.tryExtractCompany(element, pageSelector),
        img: this.tryExtractImage(element, pageSelector),
        type: 'linkedin_user_profile'
      }

      if (this.validateContact(contact))
        contactsList.push(contact)
    })

    return contactsList
  }

  tryExtractId(element, pageSelector) {
    const anchor = element.querySelector(pageSelector.contactHrefPattern)
    if (!anchor) return
    const idRegExp = new RegExp(pageSelector.contactIdPattern)
    const matches = idRegExp.exec(anchor.href)
    return matches && matches.length ? `linkedin_profile-${matches[1]}` : null
  }

  tryExtractName(element, pageSelector) {
    const anchor = element.querySelector(pageSelector.contactNamePattern)
    return anchor ? anchor.innerText : null
  }

  tryExtractUrl(element, pageSelector) {
    const anchor = element.querySelector(pageSelector.contactHrefPattern)
    return anchor ? anchor.href : null
  }

  tryExtractHeadline(element, pageSelector) {
    const target = element.querySelector(pageSelector.contactHeadlinePattern)
    return target ? target.innerText : null
  }

  tryExtractImage(element, pageSelector) {
    const img = element.querySelector(pageSelector.contactImgPattern)
    return img ? img.src : null
  }

  tryExtractCompany(element, pageSelector) {
    const target = element.querySelector(pageSelector.contactCompanyPattern)
    return target ? target.innerText : null
  }

}
