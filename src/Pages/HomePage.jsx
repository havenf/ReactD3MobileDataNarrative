import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";


function HomePage() {

  useEffect(() => {
  
  }, [])
  return (
    <section className="home-page container">
        <div className="row me-3">
          <h1 className="col-md-11">Carbon Dioxide in Relation to Fossil Fuel</h1>
        </div>
        <div className="row py-5 mx-3">
        <h2>Disclaimer</h2>
          <p className="col-md-11 pb-3">
            The environmental statistics and other data presented on this platform are for informational purposes only. 
            While the intention is to provide accurate and up-to-date information, the data shared is not intended to serve 
            as definitive scientific conclusions or to support specific research findings. Users are encouraged to 
            consult authoritative sources and experts in the field for verified and scientifically validated information. 
            This data platform makes no representations or warranties regarding the accuracy, completeness, or reliability of 
            the data provided, and any conclusions drawn from this information should be informal.
          </p><br />
          <h2>Paleoclimatology</h2>
          <p className="col-md-11 pb-3">
            Paleoclimatology is a branch of scientific study involving climate data and events specific to periods of time from earth's
            geological history. 
          </p><br />
          <h2>Vostok Ice Core Data</h2>
          <p className="col-md-11 pb-3">
            The Vostok Ice Core data is a series of records taken from ice core samples. The ice core
            samples are sourced from the deep in the ice found in the antarctic from lake Vostok where water has kept
            a time capsule for us in the form of ice. Since the antarctic temperatures do not often or ever rise above
            freezing temperatures, the state of the ice is well preserved. The ice contains atmospheric contents that 
            have been extracted by scientists and examined to determine historic levels of carbon dioxide in earth's atmosphere. 
          </p><br />

          <iframe width={window.innerWidth / 2} height={window.innerHeight / 1.3} src="https://www.youtube.com/embed/oHzADl-XID8?si=cjyHqxMLu6J28dk6" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div className="row py-5 mx-3">
          <h2>Ice Core Age Determination Methods</h2>
          <img src="src\assets\arrows-spin-solid.svg" id="fa-icon-home" className="col-md-4"/>
            <p className="col-md-6 pt-5">
              <b>1)</b> Comparing data from past cyclic climate conditions (Milankovich surface temperature cycles) and the air's 
              material composition on earth to the ice core's material composition.  <br /><br />
            </p>
           
            <img src="src\assets\chart-line-solid.svg" id="fa-icon-home" className="col-md-4"/>
            <p className="col-md-6 pt-5">
              <b>3)</b> Models used in glacialogy to predict ice-sheet flow have been utilized to understand the layering of ice and 
              its age. Inverse Monte Carlo sampling (statistical mechanics) assists in simulations designed to determine 
              ice-flow age by layer. <br /><br />
            </p>
            
        

            <img src="src\assets\cloud-solid.svg" id="fa-icon-home" className="col-md-4"/>
            <p className="col-md-6 pt-5">
              <b>2)</b> Comparing the ice core data with known athmospheric composition chronology stored in calcite deposits from Devil's 
              Hole in Nevada. This location is another paleoclimactic time capsule. <br /><br />
            </p>
            
            <img src="src\assets\volcano-solid.svg" id="fa-icon-home" className="col-md-4"/>
            <p className="col-md-6 pt-5">
              <b>4)</b> Special considerations of implications for events like the Younger Dryas Impact theory. A Theory suggesting
              around 12,900 years ago a massive asteroid made impact with earth causing megafauna extinction. Simulataneously 
              this theoretical event left a fingerprint of specific materials in the air potentially recorded in the ice cores. <br /><br />
            </p>
            
        </div>
          <div className="row py-5 mx-3"> 
            <h2>The UN Paris Agreement: Article 6</h2>
            <p className="col-md-11 pb-3">
              The UN in December of 2015 managed to internationally create legalities around climate based issues. Article six of 
              the agreement involves carbon crediting. Carbon credit is an internationally tradeable permit that has monetary value
              based on the amount of carbon emissions produced or not produced. Each credit represents one less tonne of carbon dioxide 
              emissions to be produced otherwise. The price of each credit varies from $10 to $1000 per metric ton.<br /><br />
            </p>
            <h2>The Inflation Reduciton Act: Energy Security and Climate Change Investment</h2>
            <p className="col-md-11 pb-3">
              In 2022, the United States began an act of inflation reduction alongside other pertinent issues such as climate concerns.
              Businesses are incentivized through this act to deploy lower carbon based forms of energy production. Some of these sources
              include wind, solar, and geothermal. There are also tax credits available for those who invest in nuclear, biofuels, and
              technology designed to reduce fossil fuel emissions. <br /><br />
            </p>
            <h2>Fossil Fuel Consumption Importance</h2>
            <p className="col-md-11 pb-3">
              The implications of burning fossil fuel is the release of carbon dioixide. This release is presumed to be 
              disrupting naturally cyclic levels of carbon dioxide in earth's atmosphere. These cycles are in direct relation 
              to ice ages on earth, leaving cold temperatures to historic eras with the least amount of carbon dioxide. 
              Although the levels of carbon dioxide are greater than ever recorded, predicting future outcomes with aforementioned 
              data is entirely hypothetical. <br /><br />
            </p>
          <Link to={'/data'}><button>See Data</button></Link>
          </div>
    </section>
  )
}

export default observer(HomePage)