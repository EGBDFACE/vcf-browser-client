import * as React from 'react';
import '@/css/FilterBar.scss';

interface Requirement{
    value: string,
    label: string,
    deleteFlag: boolean
}
interface Props{
    filterHeaders: string[],
    filtersChange: (requirements: Requirement[]) => void
}
interface States{
    requirementValue: string,
    requirementLabel: string,
    requirements: Requirement[],
    // requirementDeleteFlag: boolean
}

export default class FilterBar extends React.Component<Props,States>{
    constructor(props: Props){
        super(props);
        this.state = {
            requirementLabel: 'CHROM',
            requirementValue: '',
            requirements: [],
            // requirementDeleteFlag: false
        }
    }
    renderFilterHeader(index: number,value: string){
        return(
            <option key={index}>{value}</option>
        )
    }
    renderRequirement(index: number,requirement: Requirement){
        const hidden = { display: 'none' };
        return(
            <div key={index} 
                className='filterContent__requirement'
                onMouseEnter={()=>this.requirementDeleteIconEnable(index)}
                onMouseLeave={()=>this.requirementDeleteIconDisable(index)}
            >
                {requirement.label+' : '+requirement.value}
                <i onClick={()=>this.requirementDelete(index)}
                    // style={this.state.requirementDeleteFlag?undefined:hidden}
                    style={requirement.deleteFlag?undefined:hidden}
                ></i>
            </div>
        )
    }
    requirementDeleteIconEnable(index: number){
        let requirements = this.state.requirements;
        requirements[index].deleteFlag = true;
        this.setState({
            requirements: requirements
        });
        // this.setState({
        //     requirementDeleteFlag: true
        // })
    }
    requirementDeleteIconDisable(index: number){
        let requirements = this.state.requirements;
        requirements[index].deleteFlag = false;
        this.setState({
            requirements: requirements
        })
        // this.setState({
        //     requirementDeleteFlag: false
        // })
    }
    requirementValueInput(value: string){
        this.setState({
            requirementValue: value
        })
    }
    requirementLabelChange(value: string){
        this.setState({
            requirementLabel: value,
            requirementValue: ''
        })
    }
    requirementDelete(index: number){
        let newRequirements = this.state.requirements;
        newRequirements.splice(index,1);
        this.setState({
            requirements: newRequirements,
            // requirementDeleteFlag: false
        });
        this.props.filtersChange(newRequirements);
    }
    requirementAdd(){
        const newRequirement:Requirement = {
            label: this.state.requirementLabel,
            value: this.state.requirementValue,
            deleteFlag: false
        }
        let requirements = this.state.requirements;
        let existFlag: boolean = false;
        for(let i = 0;i < requirements.length; i++){
            if(requirements[i].label === newRequirement.label){
                existFlag = true;
                requirements[i].value = newRequirement.value;
                // this.setState({
                //     requirements: requirements
                // });
                break;
            }
        }
        if(!existFlag){
            requirements.push(newRequirement);
            // this.setState({
            //     requirements: this.state.requirements.concat([newRequirement])
            // })
        }
        this.setState({
            requirements: requirements
        });
        this.props.filtersChange(requirements);
    }
    allRequirementsClear(){
        this.setState({
            requirements: [],
            requirementValue: ''
        })
        this.props.filtersChange([]);
    }
    render(){
        const { filterHeaders } = this.props;
        const hidden = { display: 'none' };
        return(
            <div className='filterArea'>
                <div className='filterHeader'>
                    <span className='header__title'>Filter :</span>
                    <select className='header__select'
                        onChange={(e)=>this.requirementLabelChange(e.target.value)}
                    >
                        {filterHeaders.map((index,value)=>this.renderFilterHeader(value,index))}
                    </select>
                    <input className='header__input'
                        type='text'
                        value={this.state.requirementValue}
                        onChange={(e)=>this.requirementValueInput(e.target.value)}
                    ></input>
                    <button style={this.state.requirementValue?undefined:hidden} 
                        className='header__button' 
                        onClick={()=>this.requirementAdd()}>Add</button>
                    <span className='header__button__disable'
                        style={this.state.requirementValue?hidden:undefined}>Add</span>
                    <button style={this.state.requirements.length === 0 ? hidden : undefined} 
                        className='header__button' 
                        onClick={()=>this.allRequirementsClear()}>Clear</button>
                    <span className='header__button__disable'
                        style={this.state.requirements.length === 0 ? undefined : hidden}>Clear</span>
                </div>
                <div className='fileterContent' style={this.state.requirements.length === 0 ? hidden : undefined}>
                    {this.state.requirements.map((index,value)=>this.renderRequirement(value,index))}
                </div>
            </div>
        )
    }
}