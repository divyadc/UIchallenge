import React from "react";
import api from "../../services/searchapi";
import { FaCodeBranch, FaEye } from 'react-icons/fa';
import { MdStar } from 'react-icons/md';

export default class ListComponent extends React.Component {

    state = {
        repositories: [],
        searchCounter: {},
        page: null,
        newRepo: '',
    };

    handleInputChange = e => {
        let value = e.target.value;
        if (value === "") {
            this.setState({
                repositories: [],
                searchCounter: {},
                page: null
            })
        }
        this.setState({ newRepo: value })
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { newRepo } = this.state;
        localStorage.setItem('newRepo', newRepo);
        if (!newRepo || newRepo === "")
            alert("Enter valid searchTerm");
        else {
            this.getSearchData(newRepo, 1);
        }
    };

    async getSearchData(term, page) {
        await Promise.all([
            api.get(`/search/repositories?q=${term}`, {
                params: {
                    per_page: 10,
                    page,
                },
            }).then(searchData => {
                this.setSearchData(searchData, page);
                return searchData;
            }).catch(error => {
                alert(error);
                return error;
            }),
        ]);
    }

    setSearchData(searchData, page) {
        let tempList = [];
        if (page > 1) {
            tempList = this.state.repositories;
            tempList.push.apply(tempList, searchData.data.items);
        } else {
            tempList = searchData;
        }
        this.setState({
            repositories: searchData.data.items,
            searchCounter: searchData.data,
            page,
        });
    }

    handlePageChange = async page => {
        const newRepo = localStorage.getItem('newRepo');
        this.getSearchData(newRepo, page);
    };

    render() {
        const { newRepo, repositories, searchCounter, page } = this.state;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={newRepo}
                            onChange={this.handleInputChange}
                            placeholder="Search or jump to..."
                            className="form-control"
                        />
                    </div>
                </form>

                <React.Fragment>
                    {searchCounter?.total_count && searchCounter.total_count > 0 &&
                        <h2 className="header_count text-center">{searchCounter?.total_count} repository results</h2>
                    }
                    {repositories?.map(repository => (
                        <React.Fragment key={String(repository.id)}>
                            <div className="project_div">
                                <div className="profile_icon">
                                    <img src={repository?.owner?.avatar_url} alt=""></img>
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
                {page >= 1 && (
                    <button
                        id="more_button"
                        type="button"
                        className="show_more_bt"
                        onClick={() => this.handlePageChange(page + 1)}
                    >
                        Show More
                    </button>
                )}
            </div>
        );
    }
}