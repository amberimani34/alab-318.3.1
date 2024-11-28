const React = require('react');

class Edit extends React.Component {
    render() {
        return (
            <form action={`/api/fruits/${this.props.id}?_method=PUT`} method='POST'>
                Name: <input type='text' name='name' defaultValue={this.props.fruit.name} /> <br />
                Color: <input type='text' name='color' defaultValue={this.props.fruit.color} /> <br />
                Is Ready to Eat: 
                {this.props.fruit.readyToEat ? <input type='checkbox' name='readyToEat' defaultChecked /> : < input type='checkbox' name='readyToEat'/>}<br />
                <input type='submit' name='' value='Edit Fruit'/>
            </form>
        )
    }
}

module.exports = Edit;