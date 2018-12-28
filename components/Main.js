import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SideMenu } from 'react-native-side-menu';
import _ from 'lodash';
import { compose, withState, withHandlers, withProps, } from 'recompose';

// import Menu from './Menu';
import MenuPanel from './MenuPanel';
import SearchBox from './SearchBox';
import MovieList from './MovieList';
import FavouriteButton from './FavouriteButton';

// const TextLink = ({ loadSearch, text }) => (
//     <TouchableOpacity onPress={() => loadSearch(text)}>
//         <Text style={styles.menuLink}>{text}</Text>
//     </TouchableOpacity>
// );

// const MenuPanel = () => {
//     return (
//         <View style={styles.menuContainer}>
//             <Text h3 style={styles.menuHeadings}>Favorites</Text>
//             {props.favorites.map(f => (
//                 <TextLink loadSearch={props.loadSearch} text={f} key={'k' + f} />
//             ))}

//             <Text h3 style={[styles.menuHeadings, { marginTop: 40 }]}>History</Text>
//             {props.history.map(h => (
//                 <TextLink loadSearch={props.loadSearch} text={h} key={'h' + h} />
//             ))}
//         </View>
//     )
// };

class Main extends React.Component {
    state = {
        isLoadingComplete: false,
    };

    // onMenuItemSelected = item =>
    //     this.setState({
    //         isOpen: false,
    //         selectedItem: item,
    //     });

    render() {
        const { changeText, favorite, favoriteList, getMore, isFavorite, history, listState, loadSearch, movies, pending, search, searchText } = this.props;
        const menu = <MenuPanel favorites={favoriteList} history={history} loadSearch={loadSearch} />
        // const menu = <Menu onItemSelected={this.onMenuItemSelected} />
        return (
            // <SideMenu menu={menu}>
                <View style={styles.container}>
                    <Text h2 style={styles.heading}>MovieFōn</Text>
                    <View style={styles.topRow}>
                        <SearchBox search={search} pending={pending} changeText={changeText} searchText={searchText} />
                        <FavouriteButton isFavorite={isFavorite} favorite={favorite} searchText={searchText} />
                    </View>
                    <MovieList getMore={getMore} movies={movies} isGettingMore={listState.isGettingMore} />
                </View>
            // </SideMenu>
        );
    }
};

const enhance = compose(
    withState('pending', 'setPending', false),
    withState('listState', 'setListState', { hasMore: true, isGettingMore: false, nextPage: 2 }),
    withState('searchText', 'setSearchText', ''),
    withState('movies', 'setMovies', []),
    withState('favoriteList', 'setFavoriteList', []),
    withState('history', 'setHistory', []),
    withProps((props) => ({
        ...props,
        isFavorite: props.searchText !== '' && props.favoriteList.includes(props.searchText)
    })),
    withHandlers({
        changeText: ({ setSearchText, setMovies }) => (text) => {
            if (text === '') setMovies([])
            setSearchText(text)
        },
        search: (props) => async () => {
            const { history, searchText, setHistory, setPending, setMovies, setListState } = props
            if (searchText === '') return
            setPending(true)
            setListState({ hasMore: true, isGettingMore: false, nextPage: 2 })
            const results = await searchMovies(searchText, 1)
            if (results) {
                setMovies(results)
                setHistory(_.union(history, [searchText]))
            }
            setPending(false)
        },
        getMore: (props) => async () => {
            const { listState, movies, setMovies, searchText, setListState } = props
            const { isGettingMore, hasMore } = listState

            if (!movies.length || isGettingMore || !hasMore) return

            setListState({ ...listState, isGettingMore: true })
            const results = await searchMovies(searchText, listState.nextPage)
            if (results && results.length) {
                setMovies([...movies, ...results])
                setListState({ hasMore: true, isGettingMore: false, nextPage: listState.nextPage + 1 })
            } else {
                setListState({ hasMore: false, isGettingMore: false })
            }
        },
        favorite: ({ isFavorite, setFavoriteList, favoriteList, searchText }) => () => {
            if (searchText === '') return
            if (isFavorite) {
                setFavoriteList(favoriteList.filter(f => f !== searchText))
            } else {
                setFavoriteList([
                    ...favoriteList,
                    searchText
                ])
            }
        },
        loadSearch: ({ search, setSearchText }) => (text) => {
            setSearchText(text)
            // @HACK
            setTimeout(search, 200)
        }
    }),
);

const searchMovies = async (text, page) => {
    const params = [
        'type=movie',
        `s=${encodeURIComponent(text.trim())}`,
        `page=${page}`,
        'apikey=83041c7e'
    ]
    try {
        let result = await fetch(`http://www.omdbapi.com/?${params.join('&')}`, {
            method: 'GET',
        })
        result = await result.json()
        return result.Search
    } catch (err) {
        console.error('error', err)
        return null
    }
};

export default enhance(Main);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    heading: {
        alignSelf: 'center',
        marginVertical: 10,
        color: 'pink',
    },
    topRow: {
        flexDirection: 'row'
    },
    menuContainer: {
        flex: 1,
        backgroundColor: '#EEEEEF',
        padding: 10,
        borderColor: '#DCDDDF',
        borderWidth: 1,
    },
    menuHeadings: {
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    menuLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: 16,
        marginTop: 5,
    },
    menuFooter: {
        height: 40,
        marginRight: 20,
        alignSelf: 'flex-end',
    },
})
