import React, { useState } from 'react';
import { View, Image, Text, Linking, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unFavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import api from '../../services/api';

export interface Teacher {
    avatar: string;
    bio: string;
    cost: number;
    id: number;
    name: string;
    subject: string;
    whatsapp: string;
}

interface TeacherItemProps {
    teacher: Teacher;
    favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {

    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp() {
        api.post(`connections`, {
            user_id: teacher.id
        });

        Linking.openURL(`whatsapp://send?text=Olá ${teacher.name}, tenho interesse na sua aula de ${teacher.subject}&phone=55${teacher.whatsapp}`)
    
    }

    async function handleToggleFavorite() {
        const favorites = await AsyncStorage.getItem('favorites');
        let favoritesArray = [];

        if(favorites) favoritesArray = JSON.parse(favorites);

        if(isFavorited){
            const FavoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
                return teacherItem.id === teacher.id
            });

            favoritesArray.splice(FavoriteIndex, 1);
            setIsFavorited(false);

            await api.delete(`favorites/${teacher.id}`);
        }else{

            favoritesArray.push(teacher);
            setIsFavorited(true);

            await api.post(`favorites/${teacher.id}`);
        }

        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar}
                    source={{ uri: teacher.avatar }}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacher.name}</Text>
                    <Text style={styles.subject}>{teacher.subject}</Text>
                </View>
            </View>

            <Text style={styles.bio}>
                {teacher.bio}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.price}>
                    Preço/hora {'   '}
                    <Text style={styles.priceValue}>{teacher.cost}</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton 
                        onPress={handleToggleFavorite}
                        style={[ styles.favoriteButton, isFavorited ? styles.favorited : {} ]}
                    >
                        { isFavorited ? 
                            <Image source={unFavoriteIcon} /> 
                            : 
                            <Image source={heartOutlineIcon} /> 
                        }
                    </RectButton>

                    <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>Entrar em contato</Text>
                    </RectButton>
                </View>
            </View>
        </View>
    );
}

export default TeacherItem;