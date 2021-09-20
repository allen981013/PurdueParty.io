import './Landing.css'
import React, {Component} from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Item from '@mui/material/Grid'

interface LandingProps {
}

interface LandingStates {
}

// TODO: Integrate real data into section cards
// TODO: Add a section for living 
// TODO: Add a "navigate to" icon button in each section
// TODO: Add a decoration icon in each section

class Landing extends Component<LandingProps, LandingStates> {

  events = [
    {title:"Bowling Day", href:"events/1", time:"10.00am"}, 
    {title:"Frisbee Game", href:"events/2", time:"12.00pm"}, 
    {title:"Hello World Callout", href:"events/3", time:"4.00pm"}, 
    {title:"Movie Night", href:"events/4", time:"8.00pm"}, 
    {title:"Theatre Club Callout", href:"events/5", time:"12/12"}, 
  ]
  saleItems = [
    {title:"Ironing board", href:"marketplace/1", price:"$12"}, 
    {title:"Webcam", href:"marketplace/2", price:"$30"}, 
    {title:"Coffee Table", href:"events/3", price:"$27"}, 
    {title:"Bike", href:"marketplace/4", price:"$49"}, 
    {title:"Succulent", href:"marketplace/5", price:"$15"}, 
  ]
  classes = [
    {title:"CS 407: Software Engineering", href:"class/CS407"}, 
    {title:"CS 426: Computer Security", href:"class/CS426"}, 
    {title:"CS 426: Microeconomics", href:"class/ECON251"}, 
    {title:"STAT 512: Applied Regression Analysis", href:"class/STAT512"}, 
    {title:"MA 453: Abstract Algebra", href:"class/MA453"}, 
  ]
  clubs = [
    {title:"Archery Club", href:"clubs/1"}, 
    {title:"Asian American Association", href:"clubs/2"}, 
    {title:"Purdue Hackers", href:"clubs/3"}, 
    {title:"Actuarial Science Club", href:"clubs/4"}, 
    {title:"Hack The Future", href:"clubs/5"}, 
  ]
  eventCards = this.events.map((event) => this.getItemCard(event.title, event.href, event.time))
  saleItemCards = this.saleItems.map((item) => this.getItemCard(item.title, item.href, item.price))
  classCards = this.classes.map((class_) => this.getItemCard(class_.title, class_.href))
  clubCards = this.clubs.map((club) => this.getItemCard(club.title, club.href))
  
  constructor(props: LandingProps) {
    super(props)
  }

  getItemCard(title: string, href: string, detail?: string) {
    return (
      <div className="item-card">
        <a href={href} title={title + ", " + detail} />
        <div className="item-card__stripe"/>
        <div className="item-card__body">
          <span>{title}</span>
          {detail && <span>{detail}</span>} 
        </div>
      </div>
    )
  }
  
  getSectionCard(title: string, items?: JSX.Element[]) {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <div className="section-card">
          <div className="section-card__stripe"/>
          <div className="section-card__body">
            <div>
              <h3 style={{fontFamily: "Open Sans", fontWeight: "lighter", fontSize: "larger"}}>{title} </h3>
            </div>
            <div className="section-card__body__items">
              {items}
            </div>
          </div>
        </div>
      </Grid>
    )
  }

  render() {
    return (
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
          <Box id="cropped-purdue-img"/>
          <Grid container className="sections" spacing={2} sx={{padding: "32px 16px"}}>
            {this.getSectionCard("Events", this.eventCards)}
            {this.getSectionCard("Marketplace", this.saleItemCards)}
            {this.getSectionCard("Classes", this.classCards)}
            {this.getSectionCard("Clubs", this.clubCards)}
          </Grid>
      </Box>
    )
  }
}

export default Landing;