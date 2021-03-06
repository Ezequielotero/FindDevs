import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import style from './HirePopUp.module.css';
import axios from 'axios';
import { connect } from 'react-redux';
import JobCard from './JobCard';
import Empty from '../../Media/hiring.svg';
import { Link } from 'react-router-dom';

function HirePopUp({ color, applicantUsername, user }) {

    const [screen, setScreen] = useState(true);
    const [selection, setSelection] = useState({});
    const [jobs, setJobs] = useState([]);
    const [selectionUsers, setSelectionUsers] = useState([]);

    function getInfoAndSetProject(project) {
        axios.get(`http://localhost:5001/projects/${project.id}`)
            .then(jobsData => {
                setJobs(jobsData.data.jobOpportunities);
                setSelectionUsers(jobsData.data.users);
                setSelection({ ...selection, project: project })
            })
            .catch(err => console.log(err))
    }

    return (
        <Popup trigger={<button style={{ backgroundColor: color, border: `2px solid ${color}` }} id='btn'>HIRE</button>} modal>
            {close => (
                <div id={style.mainDiv}>
                    <div id={style.form}>
                        <button id={style.closeBtn} onClick={close}><i class="fas fa-times"></i></button>
                        {screen &&
                            <div>
                                <h1 className='font800'>Select a project</h1>
                                <div className='displayFlex' id='flexWrap'>
                                    {user.projects && user.projects.map(project =>
                                        project.userXprojects.isFounder ?
                                            <div style={{ background: selection.project && selection.project.name === project.name ? 'rgb(231,231,231' : null }} onClick={() => getInfoAndSetProject(project)} id={style.projectDiv}>
                                                <img id='icon' src={project.logo} />
                                                <span className='font200'>{project.name}</span>
                                            </div>
                                            : null
                                    )}
                                </div>
                            </div>}
                        {!screen && !selectionUsers.find(user => user.username === applicantUsername) &&
                            <div style={{ width: '80%' }}>
                                <h1 className='font800'>Jobs at {selection.project.name}</h1>
                                <div className='justifyCenter' id='alignItemsCenter'>
                                    {jobs.length > 0 ?
                                        jobs.map(job => <JobCard close={close} user={user} applicantUsername={applicantUsername} project={selection} job={job} />)
                                        :
                                        <div>
                                            <img id={style.emptyIcon} src={Empty} />
                                            <Link to={`/project/addJob/${selection.project.id}`}><button id={style.postBtn} style={{ background: selection.project.mainColor }}>Post a job</button></Link>
                                        </div>}
                                </div>
                            </div>
                        }
                        {!screen && selectionUsers.find(user => user.username === applicantUsername) &&
                            <div className='displayFlexColumn' id='alignItemsCenter'>
                                <i id={style.accepted} class="fas fa-check-circle"></i>
                                <h1 className='font800'>{applicantUsername} is already part of {selection.project.name}!</h1>
                            </div>}
                        <button disabled={!selection.project} onClick={() => setScreen(!screen)} style={{ alignSelf: 'flex-end', backgroundColor: !selection.project ? 'rgb(231,231,231)' : color, border: !selection.project ? '2px solid rgb(231,231,231)' : `2px solid ${color}` }} id={style.btn}>{screen ? 'NEXT' : 'BACK'}</button>
                    </div>
                </div>
            )}
        </Popup>
    )
}



function mapStateToProps(state) {
    return {
        user: state.userInfo
    }
}

export default connect(mapStateToProps, null)(HirePopUp);