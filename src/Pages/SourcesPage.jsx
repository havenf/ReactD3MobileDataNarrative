import { observer } from "mobx-react-lite";

function SourcesPage(){
    return (
        <section>
            <h2 className="row py-1 mx-0 px-0">Links</h2>
            <a target="_blank" href="https://ourworldindata.org/fossil-fuels"><h3>Our World In Data</h3></a>
            <a target="_blank" href="https://www.statista.com/statistics/1091926/atmospheric-concentration-of-co2-historic/"><h3>Statista</h3></a>
            <a target="_blank" href="https://www.eia.gov/energyexplained/oil-and-petroleum-products/imports-and-exports.php"><h3>Energy Information Administration</h3></a>
            <a target="_blank" href="https://tos.org/oceanography/assets/docs/17-4_alley.pdf"><h3>The Oceanography Society</h3></a>
            <a target="_blank" href="https://www.cambridge.org/core/journals/annals-of-glaciology/article/vostok-antarctica-icecore-timescale-from-datings-of-different-origins/E318B364FD6BF65DCC7442481C22F6CD"><h3>Cambridge University Press</h3></a>
            <a target="_blank" href="https://www.climateimpact.com/services-projects/carbon-credits-explained-what-they-are-and-how-they-work/#:~:text=Carbon%20credits%20are%20generated%20by,2e)%20in%20the%20atmosphere."><h3>Climate Impact Partners</h3></a>
            <a target="_blank" href="https://www.investopedia.com/inflation-reduction-act-of-2022-6362263"><h3>Investopedia</h3></a>
        </section>
    )
}

export default observer(SourcesPage);