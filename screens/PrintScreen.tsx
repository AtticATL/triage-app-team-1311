import * as React from 'react';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Profile } from '../lib/profile';
import { NavSubProps as RootNavSubProps } from "../App";
import { CHECKLIST } from '../lib/triageQuestions';
import { Checkbox } from 'native-base';



export default function PrintScreen({
    route,
    navigation,
}: RootNavSubProps<"PrintScreen">) { 
  const profile: Profile = route.params.profile;

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
    });
  }
  console.log(profile)

  var age = new Date().getFullYear() - profile.identity.birthYear;

  console.log(Object.keys(profile.triageChecklist))





  const html = `
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: left;">
            <div class="row">
                <div class="column border-right">
                    <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
                        Patient Profile 
                    </h1>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        `+ profile.identity.name +`
                    </h2>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        AGE: `+ age +`
                    </h3>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        SEX: `+ profile.identity.sex +`
                    </h3>
                    <hr>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        <u>History</u>
                    </h2>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        <b>Medical History:</b>
                        `+ profile.patientHistory.pastHistory +`
                    </h3>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        <b>History of Current Infection:</b>
                        `+ profile.patientHistory.currentInfectionHistory +`
                    </h3>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        <u>Triage Checklist</u>
                    </h2>
                    

                </div>
                <div class="column">
                    oof
                </div>
            </div>
            
        </body>
        <style>
        .column {
            float: left;
            width: 50%;
        }
        .row:after {
            content: "";
            display: table;
            clear: both;
        }    
        .border-right {
            border-right: 0.5px solid black;
        }
        </style>

    </html>
`;

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  return (
    <View style={styles.container}>
      <Button title='Print' onPress={print}  />
      <View style={styles.spacer} />
      <Button title='Save to PDF file and Share' onPress={printToFile}/>
      {Platform.OS === 'ios' &&
        <>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flexDirection: 'column',
    padding: 8,
  },
  spacer: {
    height: 8
  },
  printer: {
    textAlign: 'center',
  }
});
