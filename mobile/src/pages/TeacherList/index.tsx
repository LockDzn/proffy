import React, { useState, ReactText } from 'react';
import { View, Text, AsyncStorage, Picker } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';

import styles from './styles';

function TeacherList() {

    const [isFiltersVisible, setIsFilterVisible] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState<ReactText>('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response){
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    function handleToggleFiltersVisible() {
        setIsFilterVisible(!isFiltersVisible);
    }

    async function handleFilterSubmit() {
        loadFavorites();
        setIsFilterVisible(false);

        const respose = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });

        setTeachers(respose.data);
    }

    return (
        <View style={styles.container}> 
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                    )}
                >
                    {isFiltersVisible && (
                        <View style={styles.searchForm}>
                            <Text style={styles.label}>Matéria</Text>
                            <View style={styles.pickerBlock}>
                                <Picker
                                    selectedValue={subject}
                                    style={styles.input}
                                    onValueChange={(itemValue) => setSubject(itemValue)}
                                >
                                    <Picker.Item label="Artes" value="Artes" />
                                    <Picker.Item label="Biologia" value="Biologia" />
                                    <Picker.Item label="Ciências" value="Ciências" />
                                    <Picker.Item label="Educação física" value="Educação física" />
                                    <Picker.Item label="Geografia" value="Geografia" />
                                    <Picker.Item label="História" value="História" />
                                    <Picker.Item label="Português" value="Português" />
                                    <Picker.Item label="Química" value="Química" />
                                </Picker>
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Dia da semana</Text>
                                    <View style={styles.pickerBlock}>
                                        <Picker
                                            selectedValue={week_day}
                                            style={styles.input}
                                            onValueChange={(itemValue) => setWeekDay(itemValue)}
                                        >
                                            <Picker.Item label="Domingo" value="0" />
                                            <Picker.Item label="Domingo" value="0" />
                                            <Picker.Item label="Segunda-feira" value="1" />
                                            <Picker.Item label="Terça-feira" value="2" />
                                            <Picker.Item label="Quarta-feira" value="3" />
                                            <Picker.Item label="Quinta-feira" value="4" />
                                            <Picker.Item label="Sexta-feira" value="5" />
                                            <Picker.Item label="Sabado" value="6" />
                                        </Picker>
                                    </View>
                                    
                                </View>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Horário</Text>
                                    <TextInput 
                                        style={styles.input}
                                        value={time}
                                        onChangeText={text => setTime(text)}
                                        placeholder="Qual horário?"
                                        placeholderTextColor="#c1bccc"
                                    />
                                </View>
                            </View>

                            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Filtar</Text>
                            </RectButton>
                        </View>)
                    }
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;