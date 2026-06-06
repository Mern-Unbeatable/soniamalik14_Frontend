import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { useService } from '../../../../context/ServiceContext'
import PageHeader from '../../../../components/ui/PageHeader'
import Table from '../../../../components/ui/Table'
import Pagination from '../../../../components/ui/Pagination'
import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const ServiceAnalytics = () => {
    const { user } = useAuth();
    const { providerServices, loading, fetchProviderServices } = useService();
    const perPage = 6
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (user) {
            fetchProviderServices();
        }
    }, [user, fetchProviderServices]);

    const total = providerServices.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const startIndex = (page - 1) * perPage
    const pageData = providerServices.slice(startIndex, startIndex + perPage)

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const columns = ['Service Name', 'Service Type', 'Phone', 'ACTIONS']

    const renderRow = (item) => {
        return (
            <>
                <td className="px-4 py-4">
                    <div className="flex items-center gap-4">

                        <div className="text-base">
                            <div className="font-semibold text-cardTitle">{item.name}</div>
                        </div>
                    </div>
                </td>

                <td className="px-4 py-4 text-cardTitle">{item.type}</td>
                <td className="px-4 py-4 text-cardTitle">{item.phone}</td>
                <td className="px-8 py-4">

                    <Eye className="w-4 h-4" />

                </td>
            </>
        )
    }

    if (loading) {
        return (
            <div className='dashboardPy dashboardSpaceY'>
                <PageHeader title="Service List" />
                <div className="flex justify-center items-center h-64">
                    <p className="text-cardTitle">Loading service analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='dashboardPy dashboardSpaceY'>
            <PageHeader title="Service List" />

            <div className="mt-4">
                <div className="hidden md:block overflow-x-auto">
                    <Table columns={columns} data={pageData} renderRow={renderRow} />
                </div>

                <div className="md:hidden space-y-4">
                    {pageData.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-base font-semibold text-cardTitle">{item.name}</h3>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Service Type</p>
                                    <p className="text-cardTitle font-medium">{item.type || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="text-cardTitle font-medium">{item.phone || '-'}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Link
                                    to={`/provider/service/${item.id}`}
                                    state={{ item, from: 'service-analytics' }}
                                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-btn-primary transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        total={totalPages}
                        onChange={(p) => setPage(Math.max(1, Math.min(totalPages, p)))}
                    />
                )}
            </div>
        </div>
    )
}

export default ServiceAnalytics
