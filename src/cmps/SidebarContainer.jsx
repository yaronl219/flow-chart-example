import React from 'react'
import { connect } from 'react-redux'


function _SidebarContainer({isSidebarOpen}) {
    return (
        <div>
        </div>
    )
}

const mapStateToProps = state => {
    const {isSidebarOpen} = state.sidebarReducer
    return {
        isSidebarOpen
    };
};

const mapDispatchToProps = {

}

export const SidebarContainer = connect(mapStateToProps,mapDispatchToProps)(_SidebarContainer);
