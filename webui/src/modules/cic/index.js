import { EventEmitter } from 'events';
import _ from 'lodash';

export default class CIC extends EventEmitter {

  constructor() {
    super();
    this.spaceId = '';
    this.accessToken = '';
    this.secure = true;
    this.host = 'cic.forviz.com/v1';
    this.resolveLinks = true;
    this.agent = '';
  }

  createClient({ space, accessToken, secure = true, host, resolveLinks = true, agent }) {
    if (space) this.spaceId = space;
    if (accessToken) this.accessToken = accessToken;
    if (host) this.host = host;
    if (agent) this.agent = agent;
    this.secure = secure;
    this.resolveLinks = resolveLinks;
  }

  prepareRequest(request) {
    return {
      method: _.get(request, 'method', 'GET'),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ..._.get(request, 'headers'),
      },
      body: _.get(request, 'body'),
    };
  }

  fetch(endPoint, params) {
    return fetch(`${this.secure ? 'https' : 'http'}://${this.host}/${endPoint}`, this.prepareRequest(params))
    .then((response) => {
      return response;
    });
  }

  /*
   * (static) getSpace(id) → {Promise.<Space.Space>}
   */
  getSpace(spaceId = this.spaceId) {
    return this.fetch(`spaces/${spaceId}`)
    .then(response => ({
      sys: response.sys,
      name: response.name,
      locales: response.locales,
      item: response.item,
    }));
  }

  /*
   * (static) getSpaces() → {Promise.<Space.SpaceCollection>}
   */
  getSpaces() {
    return this.fetch('spaces')
    .then(response => response);
  }

  /*
   * (static) createSpace(data, organizationIdopt) → {Promise.<Space.Space>}
   */
  createSpace({ name, defaultLocale }, organizationId) {
    return this.fetch('spaces', {
      method: 'POST',
      headers: {
        'X-CIC-Organization': organizationId,
      },
      body: JSON.stringify({
        name,
        defaultLocale,
      }),
    })
    .then(res => ({
      sys: res.sys,
      name: res.name,
    }));
  }

  getEntries(spaceId, query) {

    // convert query to url param
    // Content Type:    {'content_type': '<id>'}  &content_type={content_type}
    // Select                                           &select=sys.id,fields.productName
    // Equal            {'fields.sku': '<sku_value>'},  &{attribute}={value}
    // InEqual          {'sys.id[ne]': '<entry_id>'}    &{attribute}[ne]={value}
    // Array equality/inequality                        &fields.{field_id}[all]={values}
    // Inclusion                                        &'fields.<field_name>[in]': 'accessories,flowers'
    // Exclusion                                        &'fields.<field_name>[nin]': 'accessories,flowers'
    // Exists                                           &'fields.<field_name>[exists]': true
    // skip: 100,                                       skip={value}
    // limit: 200,                                      limit={value}
    // order: 'sys.createdAt'
    /*
      query = {
        select:
        [field][all|ne|in|nin|exists]: value,
        skip,
        limit,
        order,
      }
    */
    const cleanQuery = _.omitBy(query, _.isEmpty);
    const urlParams = `?${_.join(_.map(cleanQuery, (value, key) => `${key}=${value}`), '&')}`;
    return this.fetch(`spaces/${spaceId}/entries/${urlParams}`)
    .then(response => response.json())
    .then(response => response);
  }

}
