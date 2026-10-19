import React, { useEffect, useState } from 'react';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { marketplaceBrands } from '../../../../data/marketplaceBrands';

const hasWebsite = (brand) => Boolean(brand.url) && brand.url !== '#';

/** "Shop Brand" clicks per marketplace brand, i.e. visits sent to the brand's website. */
const BrandClicksTable = () => {
  const [statsByKey, setStatsByKey] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await GET(ENDPOINT.MARKETPLACE.ADMIN_BRAND_CLICKS);
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        if (!cancelled) {
          setStatsByKey(Object.fromEntries(rows.map((row) => [row.brandKey, row])));
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load brand clicks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">Marketplace clicks</h2>
        <p className="mt-1 text-sm text-gray-500">
          How many times visitors clicked &quot;Shop Brand&quot; on the Marketplace page and were sent to each
          brand&apos;s website.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#E7F1F1]">
                <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Brand</th>
                <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Website</th>
                <th className="whitespace-nowrap px-6 py-4 text-right text-base font-semibold text-black">
                  Last 30 days
                </th>
                <th className="whitespace-nowrap px-6 py-4 text-right text-base font-semibold text-black">
                  All time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {marketplaceBrands.map((brand) => {
                const stats = statsByKey[brand.slug];
                return (
                  <tr key={brand.slug} className="transition-colors hover:bg-gray-50/70">
                    <td className="whitespace-nowrap px-6 py-5 text-base font-medium text-gray-800">{brand.name}</td>
                    <td className="px-6 py-5 text-base text-gray-600">
                      {hasWebsite(brand) ? (
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[#0f766e] hover:underline"
                        >
                          {brand.url}
                        </a>
                      ) : (
                        <span className="text-gray-400">No website link yet</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right text-base text-gray-800">
                      {loading ? '…' : stats?.last30Days ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right text-base font-semibold text-gray-900">
                      {loading ? '…' : stats?.total ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {error ? <p className="border-t border-gray-100 px-6 py-3 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
};

export default BrandClicksTable;
