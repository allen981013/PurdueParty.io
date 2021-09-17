import './Landing.css'
import React, {Component} from 'react'


interface LandingProps {
}

interface LandingStates {
}


class Landing extends Component<LandingProps, LandingStates> {

  eventTitles = ["Bowling Night", "Frisbee Game", "Hello World Callout", "Movie Night", "Theatre Club Callout"]
  eventCards = this.eventTitles.map((title) => this.getItemCard(title, "events/x", "4.00pm"))
  
  constructor(props: LandingProps) {
    super(props)
  }

  getItemCard(title: string, href: string, detail?: string) {
    return (
      <div className="item-card">
        <a href={href}/>
        <div className="item-card__left-stripe"/>
        <div className="item-card__body">
          <span>{title}</span>
          <span>{detail}</span>
        </div>
      </div>
    )
  }
  
  getSectionCard(title: string, items?: any) {
    return (
      <div className="section-card">
        <div className="section-card__top-stripe"/>
        <div className="section-card__body">
          <div><h2 style={{fontWeight: "lighter"}}>{title}</h2></div>
          <div className="section-card__items">
            {items}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="d-flex flex-column">
          <div id="cropped-purdue-img"/>
          <div className="sections">
            <div 
              style={{display: "flex", flexDirection: "row", justifyContent: "space-between",
                paddingBottom: "32px", width: "1200px"}}
             >
              {this.getSectionCard("Events", this.eventCards)}
              {this.getSectionCard("Marketplace")}
              {this.getSectionCard("Classes")}
            </div>
            {this.getSectionCard("Clubs")}
          </div>
      </div>
    )
  }
}

export default Landing;