import React, { useState } from 'react';
import { View, AsyncStorage } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function Favorites() {

    const [favorites, setFavorites] = useState([]);
    
    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response){
                const favoritedTeachers = JSON.parse(response);

                setFavorites(favoritedTeachers);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    return (
        <View style={styles.container}> 
            <PageHeader title="Meus Proffys favoritos ❤" />

            
            <ScrollView 
                style={styles.favoritesList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                }}
            >
                {favorites.map((teacher: Teacher) => {
                    return (
                        <TeacherItem key={teacher.id} favorited teacher={teacher} />
                    );
                })}
            </ScrollView>
        </View> 
    );
}

export default Favorites;