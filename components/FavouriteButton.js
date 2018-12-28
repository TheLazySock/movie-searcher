import React from 'react'
import { Icon } from 'react-native-elements'

class FavouriteButton extends React.Component {
    render() {
        const { isFavorite, favorite, searchText } = this.props;
        const iconName = isFavorite ? 'heart' : 'heart-o'
        return (
            searchText ? (
                <Icon
                    name={iconName}
                    type="font-awesome"
                    color="red"
                    onPress={favorite}
                    containerStyle={{ marginHorizontal: 10 }}
                />
            ) : null
        )
    }
}

export default FavouriteButton;
