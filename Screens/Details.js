import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import {firebase} from '../config'
import {useNavigation} from '@react-navigation/native';

const Details = ({route}) => {
  const todoref = firebase.firestore().collection('todos');
  const [todos, setTodos] = useState([]);

  const [textHeading, onChangeHeadingText] = useState(route.params.item.name)
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
  const updateTodo = () => {
    if(textHeading && textHeading.length > 0) {
      todoref
      .doc(route.params.item.id)
      .update({ 
        heading: textHeading,
      }).then(() => {
        navigation.navigate('Todo Malicious App')
      }).catch((error) => {
        alert(error.message)
      })
    }
  }

  return (
    <View>
      <TextInput
      style={styles.textField}
      onChangeText={onChangeHeadingText}
      value={textHeading}
      placeholder={route.params.item.heading}
       />
       <Pressable style= {styles.buttonUpdate}
       onPress={() => {updateTodo()}}
       >
        <Text>UPDATE TODO</Text>
       </Pressable>
    </View>
  )
}

export default Details

const styles = StyleSheet.create({
container: {
  marginTop: 80,
  marginLeft: 15,
  marginRight: 15,
},
textField: {
  marginBottom: 10,
  padding: 10,
  fontSize: 15,
  color: '#000000',
  backgroundColor: '#e0e0e0',
  borderRadius: 5,
},
buttonUpdate: {
  marginTop: 25,
  alignitems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 4,
  elevation: 10,
  backgroundColor: '#0de065',
}
})