import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StaffManage.scss';
import Footer from '../../components/footer/Footer';
import DataTable from 'react-data-table-component';
import { RYI_URL } from '../../URL_BE/urlbackend';
import axiosInstance from '../../service/AxiosInstance';
import PDFLink from '../../components/pdf-link/PDFLink';
import ModalMentorDetail from '../../components/modal/modal-mentor-detail/ModalMentorDetail';
import { getProfile, logout } from '../../services/service';
import NavStaff from '../../components/Nav-staff/NavStaff';

export default function StaffManage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [filter, setFilter] = useState(new URLSearchParams(location.search).get('Status') || 'ALL');
    const [mentorApplication, setMentorApplication] = useState([]);
    const [selectedMentorId, setSelectedMentorId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get('Status') || 'ALL';
        setFilter(filter);
    }, [location.search]);

    const fetchAPI = (page) => {
        setIsLoading(true);
        const params = {
            pageSize: 10,
            pageNumber: page || currentPage,
            IsDesc: true
        };

        let apiUrl = `${RYI_URL}/MentorApplication`;

        if (filter !== 'ALL') {
            apiUrl += `?Status=${filter}`;
        }

        axiosInstance.get(apiUrl, { params })
            .then(response => {
                setMentorApplication(response.data.data.data);
                setTotalRows(response.data.data.totalCount);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the mentor applications:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAPI();
    }, [filter, currentPage]);

    const fetchMyProfile = () => {
        getProfile().then((res) => {
            console.log(res)
        })
    }

    useEffect(fetchMyProfile)

    const handleFilterChange = (filterValue) => {
        setCurrentPage(1);
        navigate(filterValue === 'ALL' ? '?' : `?Status=${filterValue}`);
    };

    const columns = [
        {
            name: 'Order',
            selector: (row, index) => index + 1 + (currentPage - 1) * 10,
            width: '80px',
            headerClass: 'custom-header'
        },
        {
            name: 'Name',
            selector: row => row.fullName,
            cell: row => <div className="wrap-cell">{row.fullName}</div>,
            headerClass: 'custom-header'
        },
        {
            name: 'Email',
            selector: row => row.email,
            cell: row => <div className="wrap-cell">{row.email}</div>,
            headerClass: 'custom-header'
        },
        {
            name: 'CV',
            selector: row => <PDFLink url={row.cv} />,
            cell: row => <PDFLink url={row.cv} />,
            headerClass: 'custom-header'
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => {
                switch (row.status) {
                    case 0:
                        return <div className="wrap-cell pending">Pending</div>;
                    case 1:
                        return <div className="wrap-cell accepted">Accepted</div>;
                    case 2:
                        return <div className="wrap-cell denied">Denied</div>;
                    default:
                        return <div className="wrap-cell">Unknown</div>;
                }
            },
            headerClass: 'custom-header'
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#274a79',
                color: '#fff',
                justifyContent: 'center', // Center align header cells horizontally
            },
        },
        cells: {
            style: {
                justifyContent: 'center', // Center align cells horizontally
                alignItems: 'center', // Center align cells vertically
                display: 'flex', // Ensure flexbox layout for vertical centering
            },
        },
        rows: {
            style: {
                '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: '#f0f0f0', // Change this to your desired hover color
                },
            },
        },
    };

    const handleRowClicked = (row) => {
        setSelectedMentorId(row.id); // Assuming 'id' is the unique identifier
        setShowModal(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchAPI(page);
    };





    return (
        <>
            <NavStaff />
            <div className='staff-manage-container'>
                <div className='staff-management-filter'>
                    <div className='btn-filter-container'>
                        <button className={`btn-filter ${filter === 'ALL' ? 'active' : ''}`} onClick={() => handleFilterChange('ALL')}>ALL</button>
                        <button className={`btn-filter ${filter === 'PENDING' ? 'active' : ''}`} onClick={() => handleFilterChange('PENDING')}>PENDING</button>
                        <button className={`btn-filter ${filter === 'ACCEPTED' ? 'active' : ''}`} onClick={() => handleFilterChange('ACCEPTED')}>ACCEPTED</button>
                        <button className={`btn-filter ${filter === 'DENIED' ? 'active' : ''}`} onClick={() => handleFilterChange('DENIED')}>DENIED</button>
                    </div>
                    <div className='btn-sort'>
                        <span style={{ color: '#fff' }}>Sort By: AppliedDate</span>
                    </div>
                </div>
                <div className='CV-list-container'>
                    <h3>
                        {filter === 'ALL' && 'All CVs'}
                        {filter === 'PENDING' && 'CVs are PENDING'}
                        {filter === 'ACCEPTED' && 'CVs are ACCEPTED'}
                        {filter === 'DENIED' && 'CVs are DENIED'}
                    </h3>
                    <DataTable
                        columns={columns}
                        data={mentorApplication}
                        customStyles={customStyles}
                        onRowClicked={handleRowClicked}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationPerPage={10}
                        onChangePage={handlePageChange}
                        progressPending={isLoading}
                    />
                    {showModal && <ModalMentorDetail id={selectedMentorId} onClose={() => { setShowModal(false); fetchAPI(); }} />}
                </div>
            </div>
            <Footer backgroundColor={'#274a79'} color={'#fff'} />
        </>
    );
}
