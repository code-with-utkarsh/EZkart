import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";

import axios from "axios";
import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [auth] = useAuth();

  //getall users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      setUsers(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    if (auth?.token) getAllUsers();
  }, [auth?.token]);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3 dashboard allproduct-page">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Users</h1>
            <div className=" table-responsive">
              <table className="table table-hover ">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Address</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  { users?.map((u,i) => 
                    <tr key={u._id} className={u.role ? "table-primary" : "table-warning"}>
                     <th>{i+1}</th>
                     <td>{u.name}</td>
                     <td>{u.email}</td>
                     <td>{u.phone}</td>
                     <td>{u.address}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
