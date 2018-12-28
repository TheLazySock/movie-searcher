import React from 'react'
import { ActivityIndicator, ListView, StyleSheet, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { compose, withHandlers, withState, withPropsOnChange } from 'recompose'

class MovieList extends React.Component {
  render() {
      return (
          <ListView
            dataSource={this.props.dataSource}
            renderRow={movie => (
              <ListItem
                key={movie.imdbID}
                title={movie.Title}
                avatar={{uri:movie.Poster}}
                subtitle={`Release Year: ${movie.Year}`}
                hideChevron
              />
            )}
            automaticallyAdjustContentInsets={false} // this is iOS only
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            initialListSize={20}
            pageSize={10}
            style={styles.list}
            enableEmptySections
            onEndReached={this.props.getMore}
            onEndReachedThreshold={500}
            renderFooter={this.props.renderFooter}
          />
      )
  }
}

const getNewDataSource = () => (new ListView.DataSource({rowHasChanged: (m1, m2) => m1.imdbID !== m2.imdbID}))

const enhance = compose(
  withState('dataSource', 'setDataSource', getNewDataSource()),
  withPropsOnChange(['movies'], props => {
    const {dataSource, movies} = props
    let newDS = movies.length ? dataSource.cloneWithRows(movies) : getNewDataSource()
    return {
      ...props,
      dataSource: newDS
    }
  }),
  withHandlers({
    renderFooter: props => () => {
      if (!props.movies.length) {
        return (<Text style={styles.placeholder}>Movies will show here after a search</Text>)
        // return (<ActivityIndicator style={styles.activity} size="large" />)
      } else {
        if (props.isGettingMore) return (<ActivityIndicator size="small" />)
        else return null
      }
    }
  }),
)

// export default MovieList;
export default enhance(MovieList)

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 0,
  },
  placeholder: {
    marginVertical: 30,
    color: '#DCDDDF',
    alignSelf: 'center'
  },
  activity: {
    marginVertical: 10
  }
})
