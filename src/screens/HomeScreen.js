import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
    
      }
    render(){
        return <p>Welcome {sessionStorage.getItem("uid")}</p>
    }
}

export default Home;