import React, { useState } from "react";
import "./home.css";
import { Component } from "react";
import ApiService from "../../service/ApiService";
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import HomeCarousal from "./HomeCarousal";
import Swal from "sweetalert2";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      message: "",
      role: "",
    };
  }

  componentDidMount() {
    ApiService.fetchProducts().then((resp) => {
      this.setState({ products: resp.data });
      console.log(this.state.products);
    });

    let loginData = localStorage.getItem("loginDetails")
      ? JSON.parse(localStorage.getItem("loginDetails"))
      : null;

    if (loginData) {
      this.setState({ role: loginData.role });
    }

    setTimeout(() => {
      const reloadCount = sessionStorage.getItem("reloadCount") || 0;
      if (reloadCount < 1) {
        sessionStorage.setItem("reloadCount", String(Number(reloadCount) + 1));
        window.location.reload();
      } else {
        sessionStorage.removeItem("reloadCount");
      }
    }, 800);
  }

  addtocart = (p1) => {
    let loginData = localStorage.getItem("loginDetails")
      ? JSON.parse(localStorage.getItem("loginDetails"))
      : null;

    if (loginData && loginData.id) {
      let cartData = { customerId: loginData.id, productId: p1.id };
      ApiService.addtoCardAPI(cartData)
        .then((resp) => {
          this.setState({ message: "Item Added to Cart !!!" });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Product added to your cart successfully...",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response?.data?.message || "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
        });
    } else {
      alert("Please login");
      window.location.href = "/login";
    }
  };

  render() {
    return (
      <>
        <HomeCarousal />
        <div className="d-flex flex-wrap justify-content-center align-items-center mt-4">
          {this.state.products.map((p1) => (
            <div className="container m-2" key={p1.id} style={{ width: "16rem" }}>
              <div
                className="card mb-3 p-2"
                style={{
                  height: "26rem",
                  boxShadow: "2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.404)",
                }}
              >
                <div>
                  <img
                    className="card-img-top"
                    src={p1.imgUrl}
                    style={{ width: "200px", height: "250px" }}
                    alt="Card"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{p1.name}</h5>
                  <p className="card-text">Price: Rs.{p1.price}/-</p>
                  <hr />

                  <div className="row d-flex justify-content-around">
                    {this.state.role !== "admin" && (
                      <div className="col-5" style={{ width: "50%" }}>
                        <button className="btn btn-primary w-100" onClick={() => this.addtocart(p1)}>
                          Add
                        </button>
                      </div>
                    )}
                    <div className="col-5" style={{ width: "50%" }}>
                      <Link
                        className="btn btn-primary w-100"
                        to={{
                          pathname: "/ProductDetail",
                          state: { proId: p1.id },
                        }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr color="red" size="5" />

        <div className="d-flex flex-wrap justify-content-center align-items-center mt-4">
          <div className="column g-0">
            <div className="col-md-4">
              <img
                src="https://www.petprofessional.com.au/wp-content/uploads/2019/11/vet-listening-to-dogs-heart.jpg"
                style={{ width: "300px", height: "200px" }}
                alt="Veterinary"
              />
            </div>
            <div className="col-md-8 justify-content-center align-items-center mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  <b>Veterinary</b>
                </h5>
                <p className="card-text">
                  <i>Professional medical care for your pet</i>
                </p>
                <a href="http://localhost:3000/vet" className="btn btn-info">
                  Book an appointment
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;

{
  /* <h3 className="m-4">New Arrivals</h3>
        <div className="d-flex flex-wrap ">
          <div className="d-flex flex-row flex-wrap bd-highlight mb-3 container bg-gray" >
            
            {list1}
          </div>
        </div> */
}
