import React from 'react';
import FixedRow from './FixedRow/index';
import VaribaleRow from './VariableRow/index';
import './index.css';

const Index = () => {
    
    const Styles = {
        employeeTable: {flex: 1, backgroundColor: '#fff'}, 
    }

    return(
        <section>
            <table style={Styles.employeeTable}>
                <FixedRow />
                <VaribaleRow />
            </table>
        </section>
    )
}

export default Index;