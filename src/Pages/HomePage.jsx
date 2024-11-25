import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";


function HomePage() {

  useEffect(() => {
  
  }, [])
  return (
    <section className="home-page">
        <h1>Carbon Dioxide in Relation to Fossil Fuel Emission</h1>
        <p>
          The environmental statistics and other data presented on this platform are for informational purposes only. 
          While the intention is to provide accurate and up-to-date information, the data shared is not intended to serve 
          as definitive scientific conclusions or to support specific research findings. Users are encouraged to 
          consult authoritative sources and experts in the field for verified and scientifically validated information. 
          This data platform makes no representations or warranties regarding the accuracy, completeness, or reliability of 
          the data provided, and any conclusions drawn from this information should be informal.
        </p><br />
        <h2>Paleoclimatology</h2>
        <p>
          Paleoclimatology is a branch of scientific study involving climate data and events specific to periods of time from earth's
          geological history. 
        </p><br />
        <h2>Vostok Ice Core Data</h2>
        <p>
          The Vostok Ice Core data is a series of records taken from ice core samples. The ice core
          samples are sourced from the deep in the ice found in the antarctic from lake Vostok where water has kept
          a time capsule for us in the form of ice. Since the antarctic temperatures do not often or ever rise above
          freezing temperatures, the state of the ice is well preserved. The ice contains atmospheric contents that 
          have been extracted by scientists and examined to determine historic levels of carbon dioxide in earth's atmosphere. 
        </p><br />
        <h2>Ice Core Age Determination Methods</h2>
        <p>
          1) Comparing data from past cyclic climate conditions (Milankovich surface temperature cycles) and the air's 
          material composition on earth to the ice core material composition.  <br /><br />
          2) Comparing the ice core data with known athmospheric composition chronology stored in calcite deposits from Devil's 
          Hole in Nevada. This location is another paleoclimactic time capsule. <br /><br />
          3) Models used in glacialogy to predict ice-sheet flow have been utilized to understand the layering of ice and 
          its age. Inverse Monte Carlo sampling (statistical mechanics) assists in simulations designed to determine 
          ice-flow age by layer. <br /><br />
          4) Special considerations of implications for events like the Younger Dryas Impact theory. A Theory suggesting
          around 12,900 years ago a massive asteroid made impact with earth causing megafauna extinction simulataneously 
          leaving a fingerprint of specific materials in the air potentially recorded in the ice cores. <br /><br />
        </p>
        <h2>Fossil Fuel Consumption Importance</h2>
        <p>
          The implications of burning fossil fuels are the release of carbon dioixide. This release is presumed to be 
          disrupting naturally cyclic levels of carbon dioxide in earth's atmosphere. These cycles deal directly with 
          ice ages on earth, leaving cold temperatures to historic eras with the least amount of carbon dioxide. 
          The data reports that the levels are highest ever recorded in history based on the ice core 
          data. Predicting future outcomes with aforementioned data is entirely hypothetical. <br /><br />
        </p>
        <Link to={'/data'}><button>See Data</button></Link>
    </section>
  )
}

export default observer(HomePage)