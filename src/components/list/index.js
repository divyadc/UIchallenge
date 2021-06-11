import React from "react";
import api from "../../services/searchapi";
import Container from "../../components/container";
import { Pagination } from "./styles";
import { FaCodeBranch, FaEye } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';

export class ListComponent extends React.Component {
    state = {
        repositories: [],
        searchCounter: {},
        page: null,
        nextPage: false,
        newRepo: '',
    };

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value })
    };

    handleSubmit = async e => {
        e.preventDefault();
        console.log("handleSubmit: ", e);
        const { newRepo, page } = this.state;

        localStorage.setItem('newRepo', e);

        const [repositories] = await Promise.all([
            api.get(`/search/repositories?q=${e}`, {
                params: {
                    per_page: 10,
                    page,
                },
            }),
        ]);

        this.setState({
            repositories: repositories.data.items,
            // newRepo: '',
            searchCounter: repositories.data,
            // page: 1,
            nextPage: Boolean(
                repositories.headers.link && repositories.headers.link.includes('next')
            ),
        });
    };

    handlePageChange = async page => {
        const newRepo = localStorage.getItem('newRepo');
        const repositories = await api.get(`/search/repositories?q=${newRepo}`, {
            params: {
                per_page: 10,
                page,
            },
        });

        let tempList = new Array();
        console.log("Before:", this.state.repositories);
        if (this.state.repositories && this.state.repositories.length > 0) {
            tempList = this.state.repositories;
            tempList.push.apply(tempList, repositories.data.items);
        }
        console.log("After:", tempList + ">>>>: ", tempList.length);

        this.setState({
            repositories: tempList,
            searchCounter: repositories.data,
            page,
            nextPage: Boolean(
                repositories.headers.link && repositories.headers.link.includes('next')
            ),
        });
    };

    render() {
        const { newRepo, repositories, searchCounter, page, nextPage } = this.state;

        return (
            <Container>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={newRepo}
                        onChange={this.handleInputChange}
                        placeholder="Search or jump to..."
                    />
                </form>

                <React.Fragment>
                    <h2>{searchCounter.total_count} repository results</h2>
                    {repositories.map(repository => (
                        <React.Fragment key={String(repository.id)}>
                            <div className="project_div">
                                <div className="profile_icon">
                                    <img src={repository?.owner?.avatar_url}></img>
                                </div>
                                <div className="project_info">
                                    <div className="project_title">
                                        <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                                            {repository.owner.login} - {repository.name}
                                        </a>
                                    </div>
                                    <div className="project_desc">
                                        <p>{repository.description}</p>
                                    </div>
                                    <div className="project_count">
                                        <a href={`https://github.com/${repository.full_name}/stargazers`} target="_blank" rel="noopener noreferrer">
                                            <MdStar size={16} />
                                            {repository.stargazers_count}
                                        </a>
                                        <a href={`https://github.com/${repository.full_name}/network/members`} target="_blank" rel="noopener noreferrer">
                                            <FaCodeBranch size={13} />
                                            {repository.forks_count}
                                        </a>
                                        <a href={`https://github.com/${repository.full_name}/watchers`} target="_blank" rel="noopener noreferrer">
                                            <FaEye size={13} />
                                            {repository.watchers_count}
                                        </a>
                                        <a href={`https://github.com/` + repository.full_name + `/issues?q=is%3Aopen`} target="_blank" rel="noopener noreferrer">
                                            {repository.open_issues_count} Issues needs help
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </React.Fragment>

                <Pagination>
                    {/* {page > 1 && (
                        <button
                            type="button"
                            className="previous"
                            onClick={() => this.handlePageChange(page - 1)}
                        >
                            Previous
                        </button>
                    )} */}
                    {nextPage && (
                        <button
                            type="button"
                            className="show_more_bt"
                            onClick={() => this.handlePageChange(page + 1)}
                        >
                            Show More
                        </button>
                    )}
                </Pagination>
            </Container>
        );
    }
}