import React, { Component } from 'react'
import './Layout.css'
import ChosenFilmDetails from '../chosen_film_details/ChosenFilmDetails'
import Header from '../header/Header'
import TableOfContents from '../table_of_contents/TableOfContents'

export default class Layout extends Component {

    render() {
        return (
            <div id="layout">
                <Header />

                <div id="main-content">
                    <TableOfContents />

                    <ChosenFilmDetails />
                </div>

                
            </div>
        )
    }
}
