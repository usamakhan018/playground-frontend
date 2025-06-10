import React from 'react'

const Setting = () => {
    return (
        <div>
            <htmlForm className="htmlForm-horizontal">
                <div className="card-body">
                    <div className="htmlForm-group row">
                        <label htmlFor="inputEmail3" className="col-sm-2 col-htmlForm-label">Email</label>
                        <div className="col-sm-10">
                            <input type="email" className="htmlForm-control" id="inputEmail3" placeholder="Email" />
                        </div>
                    </div>
                    <div className="htmlForm-group row">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-htmlForm-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="htmlForm-control" id="inputPassword3" placeholder="Password" />
                        </div>
                    </div>
                    <div className="htmlForm-group row">
                        <div className="offset-sm-2 col-sm-10">
                            <div className="htmlForm-check">
                                <input type="checkbox" className="htmlForm-check-input" id="exampleCheck2" />
                                <label className="htmlForm-check-label" htmlFor="exampleCheck2">Remember me</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button type="submit" className="btn btn-info">Sign in</button>
                    <button type="submit" className="btn btn-default float-right">Cancel</button>
                </div>
            </htmlForm>
        </div>
    )
}

export default Setting
