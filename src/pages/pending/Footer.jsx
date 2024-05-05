import React from "react";


export default function Footer() {
  

  return (
    <footer className="new_footer_area bg_color">
      <div className="new_footer_top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="f_widget social-widget pl_70">
                <h3 className="f-title f_600 t_color f_size_18">Developed by Gokul and Kiran</h3>
                <div className="f_social_icon" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                  <p style={{ display: "inline-block", marginRight: "20px",color: "#fff" }}>Gokul (<a style={{color: "#55f"}} href="https://github.com/GokZ465" target="_blank" rel="noopener noreferrer">GitHub</a>)</p>
                  <p style={{ display: "inline-block"  , color: "#fff"}}>Kiran (<a style={{color: "#55f"}}  href="https://github.com/Vishwak-Kiran" target="_blank" rel="noopener noreferrer">GitHub</a>)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer_bg">
        <div className="footer_bg_one"></div>
      </div>
      <div className="footer_gif">
        {/* <img src={gifUrl} alt="Animated GIF" style={{ width: "100px", height: "120px" }} />
        <img src={gifUrl2} alt="Animated GIF" style={{ width: "100px", height: "120px" }} /> */}
      </div>
    </footer>
  );
}
