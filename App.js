import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { AppRegistry, RefreshControl, StyleSheet, Text, TextInput, View, Button, Alert, ScrollView, Image,FlatList, Picker, TouchableOpacity} from 'react-native';
import {createStackNavigator,createAppContainer,StackActions, NavigationActions} from 'react-navigation';
import {Table,Row,Rows,Col} from 'react-native-table-component';
import axios from 'axios';
import {Listm, ListItem, FormValidationMessage} from 'react-native-elements';

 class HomeScreenConsumer extends React.Component { 
    render () {
        const {navigate} = this.props.navigation; 
        return (
             <ScrollView style={{padding: 30}}>
                    <Text style = {{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color:'#28a745'}}>Welcome to the One Stop App! </Text>
                    <Button 
                        title = 'Store Front Screen'
                        onPress = { () => this.props.navigation.navigate('StoreFront') } 
                    /> 
                    <Button 
                        title = 'Modify User Info'
                        onPress = { () => this.props.navigation.navigate('ModifyUser') } 
                    /> 

                </ScrollView>
        )
    }
 }
 class HomeScreenEmployee extends React.Component { 
    render () {
        const {navigate} = this.props.navigation; 
        return (
            // Displaying Home Page of App 
             <ScrollView style={{padding: 30}}>
                    <Text style = {{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color:'#28a745'}}>Welcome to the One Stop App! </Text>
                    <Button 
                        title = 'Inventory Screen'
                        onPress = { () => this.props.navigation.navigate('Inventory') } 
                    /> 
                    <Button 
                        title = 'Store Front Screen'
                        onPress = { () => this.props.navigation.navigate('StoreFront') } 
                    /> 
                    <Button 
                        title = 'Modify User Info'
                        onPress = { () => this.props.navigation.navigate('ModifyUser') } 
                    /> 

                </ScrollView>
        )
    }
 }
 
 class InventoryScreen extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             productname:"",
             productquantity: "",
             storelocationid: "",
             products: [],
             dProduct:0,
             refresh: false,
             pids: []
         };
     }
     componentDidMount() {
         axios.get('http://localhost:4002/product')
            .then(res => {
                const product = [];
                res.data.forEach(data => {
                 product.push(data)
                })
                this.setState({
                    products: product
                })    
            }
            )
            .catch(function(error) {console.log(error);});  
            console.log(this.state.products + 'ahere'); 
    } 
    _onRefresh = () => {
        // Refreshing Page 
        this.setState({refresh: true});
        this.setState({refresh: false});
        console.log('Refresh');
    }
    deleteProduct(dProduct) {
        //Running Query to Remove Product
        axios.delete('http://localhost:4002/product/remove/' +dProduct, { data: { productid: dProduct} });
        console.log('http://localhost:4002/product/remove/'+dProduct);
        
    }
    modifyProduct() {
            //Running Query to Modify Product 
        axios.post('http://localhost:4002/product/updateproductinfo', {
            name: this.state.productquantity,
            price: this.state.storelocationid,
            pid: this.state.productname
        });
        console.log(this.state.productquantity + this.state.storelocationid);
      }
    addProductWithoutID() {
        //Running Query to Add Product to Database w/o a Product ID
        axios.post('http://localhost:4002/product/addProductWithoutID', {
            productname: this.state.productquantity,
            price: this.state.storelocationid
        });
    }
    addProductWithID() {
        //Running Query to Add Product to Database w/ a Product ID
        axios.post('http://localhost:4002/product/addProductWithID', {
            productname: this.state.productquantity,
            price: this.state.storelocationid,
            pid: this.state.productname
        });
    }
    aormProduct () { 
        //Add or Modify a Product by checking if the product ID is already in the databse 
        if(this.state.productname){
        axios.get('http://localhost:4002/product/checkid')
        .then(res => {  
            const pid = [];
            res.data.forEach(data => {
             pid.push(data.productid)
            })
            this.setState({
                pids: pid
            })
            if (this.state.pids.includes(parseInt(this.state.productname))) {
                console.log('Where you at?')
                this.modifyProduct();
            }
            else {
                console.log('This is where you are!');
                this.addProductWithID();
            }
          }
        )
        .catch(function(error) {console.log(error);}); 
    }
    else{
        this.addProductWithoutID();
    }

    }
     renderProduct = product => <View key={product.productid}></View> 
     handleProductChangeText (newText) {
        this.setState ({
            productname: newText
        });
     }
     handleQuantityChangeText (newText) {
         this.setState({
             productquantity: newText
         });
     }
     handleLocationChangeText (newText) {
         this.setState({
             storelocationid: newText
         });
     }
     render () {
         const productState = this.state.products;
         return (
            <ScrollView>
                <Text style = {{fontWeight:'bold',textAlign: 'center',fontSize:30, color:'#28a745'}}> Inventory Station </Text> 
                <Text style={{textAlign:'center'}}> Want to add items? </Text> 
                <RefreshControl 
                    refreshing={this.state.refresh}
                    onRefresh={this._onRefresh.bind(this)}
                />
                <Button
                    title = 'Refresh'
                    onPress = { this._onRefresh}
                    style = {{textAlign: 'right'}}
                />
                <Text style={{padding:10, textDecorationLine: 'underline'}}> New Product ID (optional) </Text>
                <TextInput
                    onChangeText = {productname => this.setState({productname: productname})}
                    value = {this.state.productname}
                    ref = {ref => {this._productInput = ref}}
                    autoFocus = {true}
                    autoCapitalize= "words"
                    autoCorrect={false}
                    keyboardType = "default"

                    onSubmitEditing = {this._submit}
                    blurOnSubmit = {true}
                    style={{padding:15}}
                    placeholder = 'Enter your new product id'
                    clearButtonMode = 'always'
                    
                />
                <Text style={{padding:10, textDecorationLine: 'underline', textShadowColor: 'green'}}> Product Name </Text>
                <TextInput
                    onChangeText = {productquantity => this.setState({productquantity: productquantity})}
                    style={{padding:15}}
                    placeholder = 'Enter your new product name'
                    clearButtonMode = 'always'
                />
             
                <Text style={{padding:10, textDecorationLine: 'underline'}}> Product Price </Text>
                <TextInput
                    style={{padding:15}}
                    placeholder = 'Enter price'
                    onChangeText = {storelocationid=> this.setState({storelocationid: storelocationid})}
                    clearButtonMode = 'always'
                    returnKeyType = "send"
                />
                        
                <View style = {{padding: 20,textAlign: 'center'}}>
                    <Button 
                        title='Add/Modify'
                        color='#28a745'
                        onPress = {() => {this.aormProduct();}}
                    />
               </View>
               <Text> Delete Station </Text>
               <TextInput
                    style={{padding:15}}
                    placeholder = 'Enter Product ID'
                    onChangeText = {dProduct => this.setState({dProduct: dProduct})}
               />
               <Button 
                    title = 'Delete Item'
                    color='#28a745'
                    onPress = {() => {
                        this.deleteProduct(this.state.dProduct);
                    }}
                />
                <View style={{columnWidth: 150}}>
                    <Table borderStyle = {{borderWidth: 2, flex: 2}} >
                        <Row data = {InvColoumns}  style={{backgroundColor:'#28a745'}}textStyle = {{textAlign:'center'}}/>
                    </Table>
                </View>
                <FlatList
                    data = {this.state.products}
                    renderItem= {({item}) =>
                         <Row key={item.productid} data = {[item.productid,item.productname,item.price]}  
                         borderStyle = {{borderWidth: 2, flex: 2}}
                         textStyle = {{textAlign:'center'}}
                         />   
                    }
                    keyExtractor = {(item,index) => index.toString()}
                    />
                <Button 
                    title = 'Go Back Home'
                    onPress = { () => this.props.navigation.navigate('Home') }
                />
            </ScrollView>
         )
     }
 }
class StoreFront extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            counter:0,
        }
    }
    componentDidMount() {
        axios.get('http://localhost:4002/product')
           .then(res => {
               const product = [];
               res.data.forEach(data => {
                product.push(data)
               })
               this.setState({
                   products: product
               })    
             }
           )
           .catch(function(error) {console.log(error);});  
   } 
    render () {
        return (
            <ScrollView>
                <Text style={{paddingTop: 30, textAlign: 'center',fontWeight:'bold',fontSize:30, color:'#28a745'}}> Welcome to Your One Stop Shop!</Text>
                <Text style={{textAlign: 'right', padding: 20,color:'#28a745',fontWeight:'bold'}}onPress={() => {this.props.navigation.navigate('BSignin'); signOut(); currentUser=''}}> Sign Out? </Text> 
        
                <View style={{marginTop: 50,justifyContent: 'center'}}>
                <FlatList
                    data = {this.state.products}
                    renderItem= {({item}) =>
                        <View style= {{flex:1,padding:20}}> 
                            <Text style={{flex:1,paddingBottom: 10, textAlign:'center',fontWeight:'bold'}}>{item.productname}</Text>
                            <View style={{flexDirection: 'row'}}><Image style={{width: 100, height: 100, justifyContent: 'center', alignContent: 'center'}} source={{uri:"http://www1.specialolympicsontario.com/wp-content/uploads/2017/01/Insert-Photo-Here.jpg"}}/>
                            <Text style={{flex:1, paddingTop: 5, paddingBottom: 5, marginLeft: 18}}></Text>
                        
               
                            <View style={{width:100,padding:5 }} >
                                <Text style={{flex:1, marginLeft: 0, textAlign: 'right'}}> {'Price: $' + item.price}</Text>
                                <TouchableOpacity style={{marginTop: 10}} onPress={() => {
                                    ShopCart.push([item.productname,item.price]);
                                    ShopCartPrices.push(item.price);
                                    console.log(ShopCartPrices);
                                    console.log('The sum of the array elements is ' + findSum(ShopCartPrices));
                                    }}>
                                    <Text style={{backgroundColor: '#28a745', width:100}}> Add to Cart </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginLeft: 0,marginTop: 10}} onPress={() => Alert.alert('Come back to me, I\'ll work in a few')}>
                                   
                                </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                    keyExtractor = {(item,index) => index.toString()}
                />
                <Button
                    onPress = {() => this.props.navigation.navigate('ShoppingCart')}
                    title = 'YOUR CART'
                />

             </View>
            </ScrollView>
        )
    }
}
class ShoppingCart extends React.Component {
    constructor (props) {
        super (props);
    this.state = {
        tableHead: ['Product','Price']
    }
    }
    render () {
        const state = this.state;
        return (
            <ScrollView>
                              <Text style={{textAlign: 'left', fontSize: 20}}> Your Cart </Text>
                <Text style={{textAlign: 'right', paddingLeft: 200}}onPress={() => {this.props.navigation.navigate('BSignin');signOut();currentUser=''}}> Sign Out? </Text> 
                
                <View style={{padding:20}}>
                <Table>
                    <Row data={state.tableHead} style={{backgroundColor:'#f1f8ff'}}/>
                    <Rows data ={ShopCart} />
                </Table>
                <Text>Current Running Total: ${findSum(ShopCartPrices)}</Text>
                </View>
                <Button title='Checkout'
                    onPress = {() => this.props.navigation.navigate('ConfPage')}
                    color='#28a745'
                />
            </ScrollView>
        )
    }
}
class ConfPage extends React.Component {
    render () {
        return (
            <ScrollView>
                <Text style={{textAlign:'center', padding:40,fontSize: 30, color:'green'}}>Your order has been confirmed!</Text>
                <Text style={{textAlign: 'center'}}>A digital receipt will be emailed to you at 
                    <Text style = {{fontWeight: 'bold'}}> {currentUser} </Text>
                 For</Text>
                <View style={{padding: 10}}>
                <Table borderStyle = {{borderWidth: 1, flex: 2}}>
                    <Rows data = {ShopCart} />
                    <Text>
                        <Text>Total Price </Text>
                            <Text style={{fontWeight: 'bold'}}>${findSum(ShopCartPrices)}</Text>
                    </Text>
                </Table>
               </View>
            </ScrollView> 
        )
    }
}
class StoreSignin extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentEmail:'',
            currentPassword:'',
            isValidAccount: false
        }
    }
    CheckAccount =() => {
        //Verifying Password of a Specific User during login 
        axios.post('http://localhost:4002/consumer/login', {
			
			email: this.state.currentEmail,
            password: this.state.currentPassword
    })
	.then(res => {
                this.setState ({
                    isValidAccount: res.data.isemployee
                });
                if(this.state.isValidAccount) { 
                    this.props.navigation.navigate('EmployeeHome');
                }
                else{
                    Alert.alert("Incorrect email/ password");
                }

    })
    .catch(function(err) { console.log(err);});
    }

    render () {
        return (
            <ScrollView>
			
                <Text style={style.signin}> Employee Signin</Text>
				<Text style={style.signin}> Account Email and Password</Text>
                
				<TextInput 
					style={style.fields}
                    placeholder="Email"
                    onChangeText = {ce => {this.setState({currentEmail: ce}); currentEmail=ce}}
				/>
				<TextInput 
					style={style.fields}
					placeholder = "Password"
                    secureTextEntry = {true}
                    onChangeText = {cp => {this.setState({currentPassword: cp}); currentPasword=cp}}
				/>
				
				<Button 
					onPress={() => {
                        this.state.isValidAccount=this.CheckAccount();
                        currentUser = currentEmail
					}}
					title='Submit'
				/>
				<Button style={{textAlign: 'center'}}
					onPress ={
						() => this.props.navigation.navigate('NUser')     
					}
					title= 'New User'
				/>
				
				<Button style={{textAlign: 'center'}}
					onPress ={
						() => this.props.navigation.navigate('BSignin')     
				    }
					title= 'Are you a customer?'
				/>
            </ScrollView> 
        )
    }
}

class BuyerSignin extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentEmail:'',
            currentPassword:'',
            isValidAccount: false
        }
    }
    CheckAccount =() => {
        //Verifying Customer Login Information with the Database 
        axios.post('http://localhost:4002/consumer/login', {
			
			email: this.state.currentEmail,
            password: this.state.currentPassword
    })
	.then(res => {
                console.log('-----Is Consumer-------');
                console.log(res.data.isconsumer);
                this.setState ({
                    isValidAccount: res.data.isconsumer
                });
                console.log("CheckAccount for employees was called and is "+ this.state.isValidAccount);
                if(this.state.isValidAccount) { 
                    this.props.navigation.navigate('ConsumerHome');
                }
                else{
                    Alert.alert("Incorrect email/ password");
                }

    })
    .catch(function(err) { console.log(err);});
	

    }

    render () {
        return (
            <ScrollView>
                
                <Text style={style.signin}>Consumer Signin</Text>
				<Text style={style.signin}> Account Email and Password</Text>
                
				<TextInput 
					style={style.fields}
                    placeholder="Email"
                    onChangeText = {ce => {this.setState({currentEmail: ce}); currentEmail=ce}}
				/>
				<TextInput 
					style={style.fields}
					placeholder = "Password"
                    secureTextEntry = {true}
                    onChangeText = {cp => {this.setState({currentPassword: cp}); currentPasword=cp}}
				/>
				
				<Button 
					onPress={() => {
                        this.state.isValidAccount=this.CheckAccount();
                        currentUser = this.state.currentEmail
					}}
					title='Submit'
				/>
				<Button style={{textAlign: 'center'}}
					onPress ={
						() => this.props.navigation.navigate('NUser')     
					}
					title= 'New User'
				/>
				
				<Button style={{textAlign: 'center'}}
					onPress ={
						() => this.props.navigation.navigate('SSignin')     
				    }
					title= 'Are you an employee?'
				/>
            </ScrollView> 
        )
    }
}

class NewUser extends React.Component {
	constructor(props) {
        super(props); 
        this.state = {
            newUser:'',
            newEmail:'',
            newPassword:'',
            buisnessAccount: true,
            managerAccount: false,
            newCardType:'',
            newCardNum:'',
            newCardExpire:'',
            newCardCode:''
        }
    }
        
    SwitchUserAccountType= () => {
        // Switch between which account a user is making
        if(this.state.buisnessAccount==true)
        {
            this.setState({buisnessAccount: false})
        }
        else
        {
            this.setState({buisnessAccount: true})
        }
    }

    addNewEmployee() {
        //Running Query to Add a new Employee to Employee Table

        axios.post('http://localhost:4002/employee', {
            name: this.state.newUser,
            email: this.state.newEmail,
            ismanager: 0
        });
    }
    addNewUser() {
        //Running Query to Add a new user to Consumer Table 
        axios.post('http://10.106.65.199:4002/consumer/newuser', {
            name: this.state.newUser,
            email: this.state.newEmail,
            password: this.state.newPassword
        });

        console.log("created user "+ this.state.newUser+ " email "+ this.state.newEmail+" with password "+ this.state.newPassword);
    }

    addUserCard() {
        //10.106.65.199
        //Running Query to Add a consumers Card information to the Consumer Table
        axios.post('http://10.106.65.199:4002/consumer/updatecardinfo', {
            cardnumber: this.state.newCardNum,
            cardtype: this.state.newCardType,
            expdate: this.state.newCardExpire,
            seccode: this.state.newCardCode,
            email: this.state.newEmail
        });

        console.log("added card info: " + this.state.newCardNum+" ");
    }

    renderAccType() {
        //Rendering What Account Should be Shown to a User
        if(this.state.buisnessAccount) {
            return(
                <Text
                style={{ padding: 20}}  
                    >Making buisnsess account</Text>
            )
        }
        else
        {
            return(
                <Text
                style={{ padding: 20}}  
                    >Making customer account</Text>
            )
        }
    }

    render () {
        return (

            <ScrollView>
            <Text style={{fontSize:20}}> User Creation</Text>  

            {this.renderAccType()} 
            <Text
                style={{ padding: 10}}
                onPress={() => {
                    this.SwitchUserAccountType();
                }}    
                    >Switch?</Text>
            
			<Text style={{textAlign: 'center'}}> Enter name </Text>
            <TextInput 
                style={{padding:15}}
                placeholder = 'Name'
                onChangeText = {nu => {this.setState({newUser: nu}); newUser=nu}}
            />

			<Text style={{textAlign: 'center'}}> Enter an email adress </Text>
            <TextInput 
                onChangeText = {ne => {this.setState({newEmail: ne}); newEmail=ne}}
                style={{padding:15}}
                placeholder = 'email'
            />

		    <Text style={{textAlign: 'center'}}> Enter a password</Text>
			<TextInput 
                    onChangeText = {np => {this.setState({newPassword: np}); newPassword=np}}
					style={{height: 40}}
					placeholder = "Password"
					secureTextEntry = {true}
			/>

            <Text style={{textAlign: 'center'}}> Enter Credit Card Info</Text>
			
            <TextInput 
                    onChangeText = {nct => {this.setState({newCardType: nct}); newCardType=nct}}
					style={{height: 40}}
					placeholder = "Type"
			/>

            <TextInput 
                    onChangeText = {ncn => {this.setState({newCardNum: ncn}); newCardNum=ncn}}
					style={{height: 40}}
					placeholder = "Number"
			/>
            <TextInput 
                    onChangeText = {nce => {this.setState({newCardExpire: nce}); newCardExpire=nce}}
					style={{height: 40}}
					placeholder = "Expiration Date"
			/>
            <TextInput 
                    onChangeText = {ncc => {this.setState({newCardCode: ncc}); newCardCode=ncc}}
					style={{height: 40}}
					placeholder = "Security Code"
			/>

            <Button 
                onPress={() => {
                    if( this.state.buisnessAccount )
                    { 
                        this.addNewEmployee(); 
                    }
                    else
                    {
                        this.addNewUser();

                        this.addUserCard();
                    }
                }}
                title='Create Account'
            />

            <Button 
                onPress ={ () => this.props.navigation.navigate('BSignin')
                }
                title= 'Return to Login'
			/>
            </ScrollView> 
            );
         }
    
}

class ModifyUser extends React.Component {
	constructor(props) {
        super(props); 
        this.state = {
            mUser:'',
            mEmail:'',
            mPassword:'',
            buisnessAccount: true,
            managerAccount: false,
            mCardType:'',
            mCardNum:'',
            mCardExpire:'',
            mCardCode:''
        }
    }

    ModifyUser() {
        //Change a user's information
        axios.post('http://localhost:4002/consumer/changepassword', {

            email: this.state.mEmail,
            password: this.state.mPassword
        });
    }

    ChangeCard() {
        //Changing a User's Card Information
        axios.post('http://localhost:4002/consumer/updatecardinfo', {
            cardnumber: this.state.mCardNum,
            cardtype: this.state.mCardType,
            expdate: this.state.mCardExpire,
            seccode: this.state.mCardCode,
            email: this.state.mEmail
        });
    }

    render () {
        return (

            <ScrollView>
            <Text style={style.signin}> User Update</Text>  
    

			<Text style={style.signin}> Enter your email adress </Text>
            <TextInput 
                onChangeText = {me => {this.setState({mEmail: me}); mEmail=me}}
                style={style.fields}
                placeholder = 'email'
            />

		    <Text style={style.signin}> Enter your password</Text>
			<TextInput 
                    onChangeText = {mp => {this.setState({mPassword: mp}); mPassword=mp}}
					style={style.fields}
					placeholder = "Password"
					secureTextEntry = {true}
			/>

            <Text style={style.signin}> Enter your Credit Card Info</Text>
			
            <TextInput 
                    onChangeText = {mct => {this.setState({mCardType: mct}); newCardType=mct}}
					style={style.fields}
					placeholder = "Type"
			/>

            <TextInput 
                    onChangeText = {mcn => {this.setState({mCardNum: mcn}); mCardNum=mcn}}
					style={style.fields}
					placeholder = "Number"
			/>
            <TextInput 
                    onChangeText = {mce => {this.setState({mCardExpire: mce}); mCardExpire=mce}}
					style={style.fields}
					placeholder = "Expiration Date"
			/>
            <TextInput 
                    onChangeText = {mcc => {this.setState({mCardCode: mcc}); mCardCode=mcc}}
					style={style.fields}
					placeholder = "Security Code"
			/>

	        <Button 
                onPress={() => {
                    this.ModifyUser();
                    if( !(this.state.buisnessAccount) )
                    { this.ChangeCard() }
                }}
                title='Modify Account'
            />

            <Button 
                onPress ={ () => this.props.navigation.navigate('BSignin')
                }
                title= 'Return to Login'
			/>
            </ScrollView> 
            );
         }
    
}

signOut = () => {
    //Removing Items from Shopping Cart and Changing the Current user to NULL
    while (ShopCart.length >0) {
        ShopCart.pop();
    }
    currentUser ='';
    ShopCart = '';
}
findSum = (arr) => {
    //Finding Sum of Values in the Shopping Cart 
  return Math.round((arr.reduce((a,b) => a+b, 0))*100)/100
  console.log(arr);
}
var currentUser = ''; //Determine which user the email should be sent to 
/* Storage arrays for users input */
 const InvColoumns = [
     'Product ID', 'Product Name', 'Price'
 ]
var ShopCart = [
]
const ShopCartPrices = [
]
const AppNavigator = createStackNavigator({
    // All different on pages this mobile application 
    BSignin: {screen:BuyerSignin}, //Customer Sign In
    SSignin: {screen:StoreSignin}, // Employee or Manager Sign in 
    Inventory: {screen:InventoryScreen}, // Inventory Screen
    ConsumerHome : {screen:HomeScreenConsumer}, //Home Display for Consumer 
    EmployeeHome: {screen: HomeScreenEmployee},//Home Display for Employee or Manager 
    StoreFront: {screen: StoreFront}, //Store Front Page 
    ShoppingCart: {screen: ShoppingCart}, //Shopping Cart Page 
    ConfPage: {screen:ConfPage},  //Purchase Confirmation Page 
    NUser: {screen:NewUser}, // New User Page
    ModifyUser: {screen:ModifyUser} //Change User's Information page 

});
const style = StyleSheet.create({
    container : {
        padding: 10
    },
    priced : {
        fontSize: 30 
    },
    signin: { 
        textAlign: 'center',
        height: 40,
        color: '#28a745',
        fontSize: 27,
        fontWeight: 'bold'
    },
    fields : {
        textAlign: 'center',
        height: 40,
        fontSize: 25
    }
});
//Running Mobile Application command 
export default createAppContainer(AppNavigator);