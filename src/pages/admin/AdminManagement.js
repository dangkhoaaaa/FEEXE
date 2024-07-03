import React, { useEffect, useState } from "react";
import "./AdminManagement.scss";
import logo from "../../assets/logo/logo-tote.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardUser,
  faMagnifyingGlass,
  faMoneyBillTransfer,
  faRightFromBracket,
  faUser,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import {
  getMentorsAdmin,
  getStaffsAdmin,
  getTransactionAdmin,
  getUsersAdmin,
  logout,
} from "../../services/service";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup, Pagination, Spinner } from "react-bootstrap";
import altImg from "../../assets/image/noImage.png";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModalAddStaff from "../../components/modal/modal-add-staff/ModalAddStaff";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#76ABAE",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

//User management
const UserManagement = ({ Search }) => {
  const [users, setUsers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsersAPI = () => {
    getUsersAdmin(pageIndex, pageSize, Search)
      .then((response) => {
        setIsLoading(true);
        setUsers(response.data.data.data);
        setTotalPages(response.data.data.lastPage);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsersAPI();
  }, [pageIndex, Search]); // Thêm Search vào dependency để khi Search thay đổi cũng fetch lại dữ liệu

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="management-container">
      <h2>Users Management</h2>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone Number</TableCell>
                  <TableCell align="center">Profile Picture</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.fullName}
                    </TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.phoneNumber}</TableCell>
                    <TableCell align="center">
                      <img
                        className="pro-pic"
                        src={user.profilePic ? user.profilePic : altImg}
                        alt={user.fullName}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {user.userRoles.map((role, index) => (
                        <p key={index} style={{ margin: "0px" }}>
                          {role.name}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(user.createdDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={pageIndex === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 1}
            />
            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === pageIndex}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={pageIndex === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

//Mentor Management
const MentorManagement = ({ Search }) => {
  const [mentors, setMentors] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMentorsAPI = () => {
    getMentorsAdmin(pageIndex, pageSize, Search)
      .then((response) => {
        setMentors(response.data.data.data);
        setTotalPages(response.data.data.lastPage);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMentorsAPI();
  }, [pageIndex, Search]);

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="management-container">
      <h2 className="admin-title">Mentors Management</h2>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone Number</TableCell>
                  <TableCell align="center">Profile Picture</TableCell>
                  <TableCell align="center">Job Title</TableCell>
                  <TableCell align="center">Company</TableCell>

                  <TableCell align="center">Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell component="th" scope="row">
                      {mentor.fullName}
                    </TableCell>
                    <TableCell align="center">{mentor.email}</TableCell>
                    <TableCell align="center">{mentor.phoneNumber}</TableCell>
                    <TableCell align="center">
                      <img
                        className="pro-pic"
                        src={mentor.profilePic ? mentor.profilePic : altImg}
                        alt={mentor.fullName}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {mentor.jobTitle ?? "No data"}
                    </TableCell>
                    <TableCell align="center">
                      {mentor.company ?? "No data"}
                    </TableCell>

                    <TableCell align="center">
                      {formatDate(mentor.createdDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={pageIndex === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 1}
            />
            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === pageIndex}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={pageIndex === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

//transaction management
const TransactionManagement = ({ Search }) => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactionsAPI = (page = 1, search = "") => {
    getTransactionAdmin(page, pageSize, search)
      .then((response) => {
        console.log("transaction", response.data);
        setTransactions(response.data.data.data);
        setTotalPages(response.data.data.lastPage);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactionsAPI(pageIndex, Search);
  }, [pageIndex, Search]);

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  return (
    <div className="management-container">
      <h2 className="admin-title">Transactions Management</h2>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Created Person Id</StyledTableCell>
                  <StyledTableCell>Created Person Name</StyledTableCell>
                  <StyledTableCell align="center">Mentor Name</StyledTableCell>
                  <StyledTableCell align="center">Total</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <StyledTableRow key={transaction.id}>
                    <StyledTableCell>{transaction.menteeId}</StyledTableCell>
                    <StyledTableCell>{transaction.menteeName}</StyledTableCell>
                    <StyledTableCell align="center">
                      {transaction.mentorName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {transaction.total}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {formatDate(transaction.createdDate)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={pageIndex === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 1}
            />
            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === pageIndex}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={pageIndex === totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

//staff management
const StaffManagement = ({ Search }) => {
  const [staffs, setStaffs] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStaffsAPI = () => {
    getStaffsAdmin(pageIndex, pageSize, Search)
      .then((response) => {
        setStaffs(response.data.data.data);
        setTotalPages(response.data.data.lastPage);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchStaffsAPI();
  }, [pageIndex, Search]);

  const handlePageChange = (page) => {
    setPageIndex(page);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchStaffsAPI(); // Refetch the data when the modal is closed
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="management-container">
      <div className="staff-head">
        <h2 className="admin-title">Staffs Management</h2>
        <Button onClick={handleOpenModal}>Add Staff</Button>
      </div>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell align="center">UserName</TableCell>
                  <TableCell align="center">Phone Number</TableCell>
                  <TableCell align="center">Random Password</TableCell>
                  <TableCell align="center">Created Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffs.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell component="th" scope="row">
                      {staff.fullName}
                    </TableCell>
                    <TableCell align="center">{staff.userName}</TableCell>
                    <TableCell align="center">{staff.phoneNumber}</TableCell>
                    <TableCell align="center">
                      {staff.passAutoGenerate}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(staff.createdDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={pageIndex === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 1}
            />
            {Array.from({ length: totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === pageIndex}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={pageIndex === totalPages}
            />
          </Pagination>
          {showModal && <ModalAddStaff onClose={handleCloseModal} />}
        </>
      )}
    </div>
  );
};

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserManagement Search={search} />;
      case "mentor":
        return <MentorManagement Search={search} />;
      case "transaction":
        return <TransactionManagement Search={search} />;
      case "staff":
        return <StaffManagement Search={search} />;
      default:
        return <UserManagement Search={search} />;
    }
  };

  const handleLogout = () => {
    logout()
      .then((response) => {
        console.log("Logout successful:", response);
        navigate("/signin");

        //delete cookie
        document.cookie =
          "token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
        // Clear local storage role
        localStorage.removeItem("role");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div className="admin-management">
      <div className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>TỎ TÊ</span>
        </div>
        <div
          className={activeTab === "user" ? "active" : ""}
          onClick={() => {
            setActiveTab("user");
            setSearch("");
          }}
        >
          <FontAwesomeIcon className="font-awesome-icon" icon={faUser} /> User
          Management
        </div>
        <div
          className={activeTab === "mentor" ? "active" : ""}
          onClick={() => {
            setActiveTab("mentor");
            setSearch("");
          }}
        >
          <FontAwesomeIcon
            className="font-awesome-icon"
            icon={faUserGraduate}
          />{" "}
          Mentor Management
        </div>
        <div
          className={activeTab === "transaction" ? "active" : ""}
          onClick={() => {
            setActiveTab("transaction");
            setSearch("");
          }}
        >
          <FontAwesomeIcon
            className="font-awesome-icon"
            icon={faMoneyBillTransfer}
          />{" "}
          Transaction Management
        </div>
        <div
          className={activeTab === "staff" ? "active" : ""}
          onClick={() => {
            setActiveTab("staff");
            setSearch("");
          }}
        >
          <FontAwesomeIcon
            className="font-awesome-icon"
            icon={faClipboardUser}
          />{" "}
          Staff Management
        </div>
        <div
          className="logout-btn"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </div>
      <div className="content">
        <div className="search-bar">
          <InputGroup className="mb-3 search-input-admin">
            <InputGroup.Text id="basic-addon1">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="content-item">{renderContent()}</div>
      </div>
    </div>
  );
}
