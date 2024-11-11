import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";


function HomePage() {

  useEffect(() => {

  }, [])

  return (
    <section className="home-page">
        Main Page
    </section>
  )
}

export default observer(HomePage)