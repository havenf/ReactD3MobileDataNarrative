import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";


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
        </p>
        <h2>What is paleoclimatology?</h2>
        <p>
        Throughout Earth's history, there have been times when atmospheric carbon dioxide levels were naturally high, leading 
        to warmer global temperatures. However, the current rise in carbon dioxide emissions, primarily due to the burning 
        of fossil fuels and other human activities, is unprecedented. This increase is driving rapid changes in the climate 
        system. As a result, the pace of climate change has accelerated since the Industrial Revolution, outpacing any period 
        in the past 65 million years.
        </p>
        <h2>Vostok Ice Core Data</h2>
        <p>
          The Vostok Ice Core data is a series of records taken from ice core samples. The ice core
          samples are sourced from the deep in the ice found in the antarctic from lake Vostok where water has kept
          a time capsule for us in the form of ice. Since the antarctic temperatures do not often or ever rise above
          freezing temperatures, the state of the ice is well preserved. The ice contains atmospheric contents that 
          have been extracted by scientists and examined to determine the contents of our atmosphere over many thousands 
          of years ago. 
        </p>
    </section>
  )
}

export default observer(HomePage)