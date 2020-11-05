export default class ContractChooserResolver {

  constructor(targetFetch, logger) {
    this.targetFetch = targetFetch
    this.logger = logger
  }

  async resolveContractChooser(lipageinstance) {

    this.logger.info('Resolving contract chooser')
    const headers = {
      "X-li-page-instance" : lipageinstance,
      "X-RestLi-Protocol-Version": "2.0.0",
      "X-LI-Lang": "en_US"
    }

    const licencesReponse = await this.targetFetch('https://www.linkedin.com/sales-api/salesApiIdentity?q=findLicensesByCurrentMember', {
      headers: headers,
      credentials: "include"
    })

    if (licencesReponse.status !== 200) {
      const licencesReposonseText = await licencesReponse.text()
      this.logger.error(`Error fetching licence data when resolving contract chooser - status ${licencesReponse.status} - ${licencesReposonseText}`)
      return
    }

    const licences = await licencesReponse.json()
    const licencePayload = JSON.stringify({
      viewerDeviceType: 'DESKTOP',
      identity: licences.elements[0]
    })

    const authResponse = await this.targetFetch('https://www.linkedin.com/sales-api/salesApiAgnosticAuthentication?redirect=%2F', {
      method: "POST",
      body: licencePayload,
      headers: Object.assign({ "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }, headers),
      credentials: "include"
    })

    if (authResponse.status !== 200) {
      const authReposonseText = await authResponse.text()
      this.logger.error(`Error posting licence data when resolving contract chooser - status ${authResponse.status} - ${authReposonseText}`)
      return
    }

    this.logger.info('Contract chooser resolved')
  }
}
