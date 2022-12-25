import { View, Text, FlatList, StyleSheet, Pressable, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React, {useState, useEffect} from 'react'
import {firebase} from '../config';
import { FontAwesome } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native'
import { keyboardProps } from 'react-native-web/dist/cjs/modules/forwardedProps';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const todoref = firebase.firestore().collection('todos');
  const [addData, setAddData] = useState('');
const navigation = useNavigation();

useEffect(() => {
  todoref
  .orderBy('createdAt', 'desc')
  .onSnapshot(
    querySnapshot => {
      const todos = []
      querySnapshot.forEach((doc) => {
        const {heading} = doc.data();
        todos.push({
          id: doc.id,
          heading,
        })
      })
      setTodos(todos)
    }
  )
}, [])

const deleteTodo = (todos) => {
  todoref
  .doc(todos.id)
  .delete()
  .then(()=>{
    alert("Delete Successfully")
  })
  .catch(error => {
    alert(error)
  })
}

const addTodo = () => {
  if (addData && addData.length> 0){
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: addData,
      createdAt : timestamp,
    };
    todoref
    .add(data)
    .then(() => {
      setAddData('');
      Keyboard.dismiss();
    }) 
    .catch((error) => {
      alert(error)
    })
  }
}

return (
  <View style={{flex:1}}>
    <View style={styles.formContainer}>
<TextInput 
style={styles.input}
placeholder="Add a new todo"
placeholderTextColor='#aaaaaa'
onChangeText={(heading)=> {setAddData(heading)}}
value={addData}
underlineColorAndroid='transparent'
autoCapitalize='none'
 />
 <TouchableOpacity style={styles.button} onPress={addTodo}>
  <Text style={styles.buttonText}>Add</Text>
 </TouchableOpacity>
    </View>
    <FlatList 
    data={todos}
    numColumns={1}
    renderItem={({item})=> (
      <View>
      <Pressable
      style={styles.container}
      onPress={()=> navigation.navigate('Details', {item})}
      >
      <FontAwesome 
        name='trash-o'
        color='red'
        onPress={() => deleteTodo(item)}
        style={styles.todoIcon}
      />
      <View>
        <Text>
          {item.heading[0].toUpperCase()+ item.heading.slice(1)}
        </Text>
      </View>

      </Pressable>
      </View>
    )}
     />
  </View>
)
 
}

export default Home

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputContainer: {
alignItems: 'center',
flexDirection: 'column',
marginLeft: 45,
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#778eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14
  }
})