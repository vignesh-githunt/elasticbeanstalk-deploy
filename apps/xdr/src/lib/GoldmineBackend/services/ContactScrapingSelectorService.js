export default class ContactScrapingSelectorService {

  constructor(fetchGraphql, logger) {
    this.fetchGraphql = fetchGraphql
    this.logger = logger
  }

  async getPageSelectors() {
    const selectors = await this.fetchPageSelectors(`${location.hostname}${location.pathname}`)
    if (!selectors.length) {
      this.logger.fatal(`No scraping selectors found for url ${location.href}`)
    }

    return selectors
  }

  async fetchPageSelectors(url) {
    const res = await this.fetchGraphql(`
      query scrapingSelectors($url: String!) {
        scrapingSelectors(order: { createdAt: DESC }, where: { urlMatch_contains: $url }) {
          id
          urlMatch,
          testPattern
          contactIdPattern
          contactImgPattern
          contactHrefPattern
          contactNamePattern
          searchResultsPattern
          contactCompanyPattern
          contactHeadlinePattern
          searchResultsContainer
        }
      }
    `, { url })

    return res.data.scrapingSelectors
  }
}
