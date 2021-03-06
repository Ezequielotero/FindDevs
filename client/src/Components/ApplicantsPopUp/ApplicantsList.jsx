import React, { useState } from 'react';
import style from './ApplicantsPopUp.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Media/Loading.gif';
import Empty from '../../Media/Empty.svg';

function ApplicantsList({ job, projectName, applicants, close, setDecided, setApplicants }) {

    const [loading, setLoading] = useState(false);

    function acceptApplicant(applicantName) {
        var message = `🎉 You are now part of ${projectName}! 🎉`;
        setLoading(true);

        axios.post(`http://localhost:5001/users/${applicantName}/project/${job.projectId}`, { jobTitle: job.title })
            .then(res => {
                return axios.post(`http://localhost:5001/users/${applicantName}/notifications`, { content: message, type: 'Acceptance', projectId: job.projectId })
            })
            .then(res => axios.delete(`http://localhost:5001/jobs/${job.id}`))
            .then(res => {
                setLoading(false);
                setDecided(applicantName);
                setTimeout(() => {
                    close()
                    window.location.reload()
                }, 3000);
            })
            .catch(err => console.log(err))
    }

    function rejectApplicant(applicantName) {
        axios.delete(`http://localhost:5001/jobs/${job.id}/applicants`, { data: { username: applicantName }})
            .then(res => {
                const filteredApplicants = applicants.filter(applicant => applicant.username !== applicantName);
                setApplicants(filteredApplicants);
            })
            .catch(err => console.log(err))
    }

    return (
        !loading ?
            <div id={style.form}>
                <button id={style.closeBtn} onClick={close}><i class="fas fa-times"></i></button>
                <h1 className='font200'>{job.title}</h1>
                <div className='displayFlex'>
                    {job.skills.map(skill =>
                        <span style={{ background: skill.strongColor, color: skill.softColor }} className={style.requirement}>{skill.label}</span>
                    )}
                </div>
                <div id={style.topApplicantDiv}>
                    {applicants.map(applicant =>
                        <div id={style.applicantDiv}>
                            <div className='displayFlex' id='alignItemsCenter'>
                                <div id={style.profilePic}></div>
                                <span id={style.username}>{`@ ${applicant.username}`}</span>
                                <button style={{ color: 'green' }} onClick={() => acceptApplicant(applicant.username)} className={style.dropdownBtn}><i class="fas fa-check-circle"></i></button>
                                <button style={{ color: 'red' }} onClick={() => rejectApplicant(applicant.username)} className={style.dropdownBtn}><i class="fas fa-times-circle"></i></button>
                            </div>
                            <div id={style.socialMediaDiv}>
                                <Link to={`/user/${applicant.username}`}><i style={{ color: applicant.color }} class="fas fa-address-card"></i></Link>
                                {applicant.gitHub && <a target='blank' href={applicant.gitHub} style={{ textDecoration: 'none', color: applicant.color }}><i class="fab fa-github-square"></i></a>}
                                {applicant.linkedIn && <a target='blank' href={applicant.linkedIn} style={{ textDecoration: 'none', color: applicant.color }}><i class="fab fa-linkedin"></i></a>}
                                {applicant.twitter && <a target='blank' href={applicant.twitter} style={{ textDecoration: 'none', color: applicant.color }}><i class="fab fa-twitter-square"></i></a>}
                            </div>
                        </div>
                    )}
                </div>
                {applicants.length === 0 && 
                <div id={style.emptyDiv}>
                    <img id={style.empty} src={Empty} />
                    <Link to='/workers'><button id='btn' style={{ background: 'black' }}>Search for developers</button></Link>
                </div>}
            </div> :
            <div id={style.form}>
                <img id='icon' src={Loading} />
            </div>
    )
}

export default ApplicantsList;