import React from 'react'
import Socials from '../components/Socials'
import dashboard from '../assets/images/projects/ims/dashboard.png'
import roles from '../assets/images/projects/ims/roles.png'
import permissions from '../assets/images/projects/ims/permissions.png'
import users from '../assets/images/projects/ims/users.png'
import inventory from '../assets/images/projects/ims/inventory.png'
import products from '../assets/images/projects/ims/products.png'
import warehouse from '../assets/images/projects/ims/warehouse.png'
import suppliers from '../assets/images/projects/ims/inventory.png'
import category from '../assets/images/projects/ims/category.png'
import print from '../assets/images/projects/ims/print.png'
import byCategory from '../assets/images/projects/ims/filter_bycategory.png'
import byWarehouse from '../assets/images/projects/ims/filter_bywarehouse.png'
import byLocation from '../assets/images/projects/ims/filter_bylocation.png'
import Contact from '../components/Contact'
import { Link } from 'react-router-dom'

const Ims = () => {
    return (
        <div>
            <Socials />
            {/* Hero */}
            <section
                id="hero"
                style={{ height: "100%", width: "100%" }}
                className="d-flex align-items-center"
            >
                <div className="container-fluid col-xxl-10 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-8">
                            <a target="_blank" href={dashboard}>
                                <img
                                    src={dashboard}
                                    loading="lazy"
                                    style={{ width: "100%" }}
                                    alt=""
                                />
                            </a>
                        </div>
                        <div className="col-lg-4">
                            <h1 className="display-6 fw-bold lh-1 mb-3">
                                Invenotry Managment System
                            </h1>
                            <p className="lead"></p>
                            <h5>Complete Multi Warehoues Management System.</h5>
                            <p>
                                Welcome to our Inventory Management System, designed for businesses
                                to streamline operations across multiple locations and supplierss.
                                Easily organize inventory by location and warehouse, manage units,
                                suppliers, and product categories. Our system establishes seamless
                                relationships between products, ensuring efficient control and
                                optimization of inventory processes. Experience unparalleled
                                visibility and control to minimize costs and drive growth in today's
                                competitive market.
                            </p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <p />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-lg px-4"
                                >
                                    Contact me
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Roles Management */}
            <section id="property" className="d-flex align-items-center">
                <div className="container-fluid col-xxl-10 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-lg-4">
                            <h1 className="display-8 fw-bold lh-1 mb-3">
                                Empower Your Team with Flexible User Management
                            </h1>
                            <p className="lead"></p>
                            <p>
                                In our User Management feature, the power lies in the hands of the
                                super admin, enabling them to tailor access and responsibilities to
                                fit the unique needs of their organization. With the ability to
                                create distinct roles, the super admin can finely tune permissions
                                and privileges, ensuring that each user has precisely the level of
                                access they require. Whether it's a warehouse manager, a sales
                                representative, or an administrative assistant, roles can be
                                customized to reflect specific job functions and responsibilities.
                                Furthermore, the super admin can effortlessly create new users and
                                assign them to appropriate roles, facilitating smooth onboarding
                                processes and ensuring that every team member has access to the
                                tools they need to succeed. This dynamic approach to user management
                                empowers organizations to adapt quickly to changing needs and
                                evolving business requirements, maximizing efficiency and
                                productivity across the board.
                            </p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <p />
                            </div>
                        </div>
                        <div className="col-10 col-sm-8 col-lg-8">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div id="carouselExampleCaptions" class="carousel  carousel-dark slide">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <Link
                                                            target="_blank"
                                                            to={inventory}
                                                        >
                                                            <img
                                                                src={inventory}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Products By Category</h5>
                                                            <p>Some representative placeholder content for the second slide.</p>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <Link
                                                            target="_blank"
                                                            to={roles}
                                                        >
                                                            <img
                                                                src={roles}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Second slide label</h5>
                                                            <p>Some representative placeholder content for the second slide.</p>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <Link
                                                            target="_blank"
                                                            to={permissions}
                                                        >
                                                            <img
                                                                src={permissions}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Third slide label</h5>
                                                            <p>Some representative placeholder content for the third slide.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="visually-hidden">Previous</span>
                                                </button>
                                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span class="visually-hidden">Next</span>
                                                </button>
                                            </div>
                                            <div
                                                id="carouselExampleControls"
                                                className="carousel slide carousel-dark pointer-event"
                                                data-bs-ride="carousel"
                                            >
                                                <div className="carousel-inner">
                                                    <div className="carousel-item">
                                                        <Link
                                                            target="_blank"
                                                            to={inventory}
                                                        >
                                                            <img
                                                                src={inventory}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="carousel-item">
                                                        <Link
                                                            target="_blank"
                                                            to={roles}
                                                        >
                                                            <img
                                                                src={roles}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="carousel-item">
                                                        <Link
                                                            target="_blank"
                                                            to={permissions}
                                                        >
                                                            <img
                                                                src={permissions}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="carousel-item active">
                                                        <Link
                                                            target="_blank"
                                                            to={inventory}
                                                        >
                                                            <img
                                                                src={inventory}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <a
                                                    className="carousel-control-prev"
                                                    href="#carouselExampleControls"
                                                    role="button"
                                                    data-bs-slide="prev"
                                                >
                                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                                    <span className="visually-hidden">Previous</span>
                                                </a>
                                                <a
                                                    className="carousel-control-next"
                                                    href="#carouselExampleControls"
                                                    role="button"
                                                    data-bs-slide="next"
                                                >
                                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                                    <span className="visually-hidden">Next</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Property Management */}
            <section id="property" className="d-flex align-items-center">
                <div className="container-fluid col-xxl-10 px-4 py-5">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-8">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <a
                                                target="_blank"
                                                href={products}
                                                data-toggle="lightbox"
                                                data-gallery="example-gallery"
                                                className="col-lg-6 col-md-6 col-6 my-3"
                                            >
                                                <img
                                                    src={products}
                                                    className="img-fluid card"
                                                />
                                            </a>
                                            <a
                                                target="_blank"
                                                href={warehouse}
                                                data-toggle="lightbox"
                                                data-gallery="example-gallery"
                                                className="col-lg-6 col-md-6 col-6 my-3"
                                            >
                                                <img
                                                    src={warehouse}
                                                    className="img-fluid card"
                                                />
                                            </a>
                                            <a
                                                target="_blank"
                                                href={category}
                                                data-toggle="lightbox"
                                                data-gallery="example-gallery"
                                                className="col-lg-6 col-md-6 col-6 my-3"
                                            >
                                                <img
                                                    src={category}
                                                    className="img-fluid card"
                                                />
                                            </a>
                                            <a
                                                target="_blank"
                                                href={suppliers}
                                                data-toggle="lightbox"
                                                data-gallery="example-gallery"
                                                className="col-lg-6 col-md-6 col-6 my-3"
                                            >
                                                <img
                                                    src={suppliers}
                                                    className="img-fluid card"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <h1 className="display-6 fw-bold lh-1 mb-3">
                                Explore Our Comprehensive Product Management
                            </h1>
                            <p className="lead"></p>
                            <p>
                                <b>
                                    <i>Explore</i>
                                </b>{" "}
                                our Product Management section, central to our system's efficiency.
                                Each product represents a vital asset in your inventory. From raw
                                materials to finished goods, effortlessly create and manage products
                                for streamlined inventory tracking. <br />
                                <b>
                                    <i>Capture</i>
                                </b>{" "}
                                essential details like name, description, price, and quantity,
                                ensuring comprehensive insights. Categorize products for intuitive
                                organization and retrieval, enhancing efficiency.
                                <br />
                                But it doesn't end there. Products are seamlessly connected to
                                locations, warehouses, units, suppliers, and categories, ensuring
                                precise tracking throughout your inventory ecosystem. <br />
                                <b>
                                    <i>With</i>
                                </b>{" "}
                                Product Management, optimize operations and drive growth. Experience
                                seamless product tracking and elevate your inventory management
                                effortlessly.
                            </p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <p />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Unit Management */}
            <section id="property" className="d-flex align-items-center">
                <div className="container-fluid col-xxl-10 px-4 py-5">
                    <h1 className="display-6 fw-bold lh-1 mb-3">
                        Streamline Inventory Management with Advanced Features
                    </h1>
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-lg-4">
                            <p className="lead"></p>
                            <p>
                                <b>
                                    <i>Filtering Options:</i>
                                </b>
                                <br />
                                Enhance your browsing experience with our advanced filtering
                                options. Products can now be sorted effortlessly by categories,
                                warehouses, and location, ensuring swift access to the items you
                                need. Whether you're searching for specific categories of products
                                or pinpointing inventory stored in particular warehouses across
                                various locations, our filtering capabilities empower you to
                                navigate through your inventory with precision and ease. Say goodbye
                                to tedious manual searches and hello to streamlined inventory
                                management with our intuitive filtering features.
                                <br />
                                <b>
                                    <i>Label Printing:</i>
                                </b>
                                <br />
                                Revolutionize your inventory identification process with our label
                                printing functionality. Users can now generate and print labels for
                                products, equipped with both barcode and QR code technology,
                                enabling seamless product tracking and identification within the
                                system. With the ability to print labels directly from the platform,
                                users can effortlessly affix labels to products, streamlining
                                inventory management processes and enhancing efficiency. Say goodbye
                                to manual labeling efforts and hello to automated inventory tracking
                                with our intuitive label printing feature.
                            </p>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <p />
                            </div>
                        </div>
                        <div className="col-10 col-sm-8 col-lg-8">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div id="carouselExampleCaptions" class="carousel  carousel-dark slide">
                                                <div class="carousel-indicators">
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                                </div>
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <Link to={byCategory} target='_blank'>
                                                            <img
                                                                src={byCategory}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Products By Category</h5>
                                                            <p>Some representative placeholder content for the second slide.</p>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <Link to={byLocation} target='_blank'>
                                                            <img
                                                                src={byLocation}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Second slide label</h5>
                                                            <p>Some representative placeholder content for the second slide.</p>
                                                        </div>
                                                    </div>
                                                    <div class="carousel-item">
                                                        <Link to={byWarehouse} target='_blank'>
                                                            <img
                                                                src={byWarehouse}
                                                                loading="lazy"
                                                                className="img-fluid card"
                                                            />
                                                        </Link>
                                                        <div class="carousel-caption d-none d-md-block">
                                                            <h5>Third slide label</h5>
                                                            <p>Some representative placeholder content for the third slide.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="visually-hidden">Previous</span>
                                                </button>
                                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span class="visually-hidden">Next</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <Contact />
        </div>
    )
}

export default Ims
