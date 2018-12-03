import React, { Component } from 'react';
import axios from 'axios';

export default class LoaderComponent extends Component {
   constructor(props) {
      super(props);
      this.state = this.state = {name:'',company:'',
         blog: '',
         avatar:'',
         loading: false
       }
      }
       componentDidMount()
       {
         axios.get("https://api.github.com/users/KrunalLathiya")
           .then(response => {
             this.setState({
               name:response.data.name,
               company:response.data.company,
               blog: response.data.blog,
               avatar:response.data.avatar_url,
               loading: false
             });
           })
           .catch(error => {
             console.log(error);
           });
       }

   render() {
      var data = <img  data-src={ require('./image.gif') } />
      return(
      <div>
            {data}
       </div>
     );
   }
}
