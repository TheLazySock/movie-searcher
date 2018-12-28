import React from 'react'
import { SearchBar } from 'react-native-elements'

class SearchBox extends React.Component {
    render() {
        const {pending, changeText, search, searchText} = this.props;
        return (
            <SearchBar
                containerStyle={{ flex: 1 }}
                clearButtonMode="always"
                editable={!pending}
                lightTheme
                onChangeText={changeText}
                onEndEditing={search}
                placeholder="Search by title"
                showLoadingIcon={pending}
                value={searchText}
            />
        )
    }
}

export default SearchBox;
