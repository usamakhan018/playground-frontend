import image from '../assets/images/image.jpg'
import Contact from '../components/Contact'
import Projects from '../components/Projects'
import Socials from '../components/Socials'
function Home() {
  return (
    <>
      <Socials />
      <section id="hero">
        <div className="container col-xxl-8 px-4 py-5">
          <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
            <div className="col-10 col-sm-8 col-lg-6">
              <img
                src={image}
                style={{ borderRadius: "50%" }}
                className="d-block mx-lg-auto img-fluid"
                alt="Bootstrap Themes"
                width="80%"
                height="80%"
                loading="lazy"
              />
            </div>
            <div className="col-lg-6 d-flex justify-content-end">
              <div>
                <h1 className="display-5 fw-bold lh-1 mb-3">Muhammad Usama</h1>
                <p className="lead"></p>
                <h4>Laravel React Developer</h4>
                <p />
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                  <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">
                    See Projects
                  </button>
                  <div className="d-flex justify-content-between gap-2 align-items-center">
                    <a target="_blank" href="https://github.com/usamakhan018">
                      <img
                        loading="lazy"
                        style={{ width: "3rem" }}
                        src="https://www.cdnlogo.com/logos/g/55/github.svg"
                      />
                    </a>
                    <a target="_blank" href="https://linkedin.com/in/usamakhan018">
                      <img
                        style={{ width: "3rem" }}
                        loading="lazy"
                        src="https://www.cdnlogo.com/logos/l/66/linkedin-icon.svg"
                      />
                    </a>
                    <a target="_blank" href="https://wa.me/923169509803">
                      <img
                        style={{ width: "3rem" }}
                        loading="lazy"
                        src="https://www.cdnlogo.com/logos/w/35/whatsapp-icon.svg"
                      />
                    </a>
                    <a target="_blank" href="https://t.me/usamakhan018">
                      <img
                        style={{ width: "3rem" }}
                        loading="lazy"
                        src="https://www.cdnlogo.com/logos/t/57/telegram-2019.svg"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm breadcrumbs">
              <ul>
                <li><a>Home</a></li>
                <li><a>Documents</a></li>
                <li>Add Document</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Projects />
      <Contact />
    </>
  )
}

export default Home
