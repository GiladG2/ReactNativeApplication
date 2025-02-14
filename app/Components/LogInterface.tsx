import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import ExerciseLogged from './ExerciseLogged'
interface LogInterfaceProps {


}
const LogInterface = () => {
  return (<>
  <View style={styles.logDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reps:</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCurretReps(currentReps - 1)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.counterInput}
                value={String(currentReps)}
                editable={false}
              />
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCurretReps(currentReps + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight :</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCurrentWeight(currentWeight - 2.5)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.counterInput}
                value={String(currentWeight)}
                editable={false}
              />
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCurrentWeight(currentWeight + 2.5)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveContainer} onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loggedExercisesContainer}>
            {exercisesLogged.map((exercise) => (
              <ExerciseLogged
                key={exercise.order}
                exercise={exercise}
                date={date}
                setExercisesLogged={setExercisesLogged}
                setOrder={setOrder}
              />
            ))}
        </View>
  </>
  )
}

export default LogInterface

const styles = StyleSheet.create({
      container:{
      }

})