// components/FallingImages.js
import React from 'react';

const images = [
    
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.45.108.25.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/86.271.9_IMLS_PS3.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2015.74_in_situ_PabloHelguera_photograph.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2020.27_view01_PS9.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2015.56.10_Gaskell_photograph.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/COLL.2012.70.10.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2018.63.3a-c_view01.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1993.90_view01_first.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2004.38.7.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2004.38.14_titlepage.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2010.13.2.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/84.203.19.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/82.171.5_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1992.98.1a-b_1992.98.2_1992.98.3a-b_SL1.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/85.158.1a-b_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/81.275_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/77.187.2_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.1995.193.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2011.16.11.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2013.83.5.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.82.119.9_bottom.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/80.169.2_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/76.99.22a-b_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/66.183_acetate_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2002.62.16a-b_transp6214.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2020.17a-b_view01_PS11.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.65.152_view1.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/85.137_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1993.127.10_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1993.127.9_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/40.376_acetate_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1994.165.75.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1994.165.74.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2000.50.2.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/76.42.6a-b_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/66.207_acetate_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/84.234.1_PS6.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/85.125.5_side1_PS1.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1999.63.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/68.55_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1991.303_PS9.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/2010.81_PS6.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1998.60_SL3.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/1994.7_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/88.134.2_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/68.224.6_bw.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.1991.14.5.jpg",
        "https://brooklynmuseum.b-cdn.net/collections/objects/CUR.2017.31.32_recto_Kramarsky_photograph.jpg"
];

const FallingImages = () => {
  return (
    
    <div className="falling-images-container">
        <div className={"font-bold"} style={{marginLeft: '5vw', height: '100vh', width: '200vh', display: 'flex' }}>
      <h1 style={{ fontSize: '5vh', color: 'rgba(255, 255, 255, 0.3)', zIndex: '-2', lineHeight:'1'}}>brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. brooklyn museum. </h1>
    </div>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          className="falling-image"
          style={{
            zIndex: `${Math.random() * -1}`, // Random horizontal position
            left: `${(Math.random() * 200) - 100}vw`, // Random horizontal position
            animationDuration: `${5 + Math.random() * 5}s`, // Random duration between 5s and 10s
            animationDelay: `${Math.random() * 5}s` // Random delay up to 5s
          }}
          alt="falling"
        />
      ))}
    </div>
  );
};

export default FallingImages;
