import { Asset } from "xdb-digitalbits-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";

/**
 * Creates a new {@link TradesCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#trades}.
 *
 * @class TradesCallBuilder
 * @extends CallBuilder
 * @constructor
 * @see [Trades](https://developers.digitalbits.io/reference/go/services/frontier/internal/docs/reference/endpoints/trades)
 * @param {string} serverUrl serverUrl Frontier server URL.
 */
export class TradesCallBuilder extends CallBuilder<
  ServerApi.CollectionPage<ServerApi.TradeRecord>
> {
  constructor(serverUrl: URI) {
    super(serverUrl);
    this.url.segment("trades");
  }

  /**
   * Filter trades for a specific asset pair (orderbook)
   * @param {Asset} base asset
   * @param {Asset} counter asset
   * @returns {TradesCallBuilder} current TradesCallBuilder instance
   */
  public forAssetPair(base: Asset, counter: Asset): this {
    if (!base.isNative()) {
      this.url.setQuery("base_asset_type", base.getAssetType());
      this.url.setQuery("base_asset_code", base.getCode());
      this.url.setQuery("base_asset_issuer", base.getIssuer());
    } else {
      this.url.setQuery("base_asset_type", "native");
    }
    if (!counter.isNative()) {
      this.url.setQuery("counter_asset_type", counter.getAssetType());
      this.url.setQuery("counter_asset_code", counter.getCode());
      this.url.setQuery("counter_asset_issuer", counter.getIssuer());
    } else {
      this.url.setQuery("counter_asset_type", "native");
    }
    return this;
  }

  /**
   * Filter trades for a specific offer
   * @param {string} offerId ID of the offer
   * @returns {TradesCallBuilder} current TradesCallBuilder instance
   */
  public forOffer(offerId: string): this {
    this.url.setQuery("offer_id", offerId);
    return this;
  }

  /**
   * Filter trades for a specific account
   * @see [Trades for Account](https://developers.digitalbits.io/reference/go/services/frontier/internal/docs/reference/endpoints/trades-for-account)
   * @param {string} accountId For example: `GBYTR4MC5JAX4ALGUBJD7EIKZVM7CUGWKXIUJMRSMK573XH2O7VAK3SR`
   * @returns {TradesCallBuilder} current TradesCallBuilder instance
   */
  public forAccount(accountId: string): this {
    this.filter.push(["accounts", accountId, "trades"]);
    return this;
  }
}
