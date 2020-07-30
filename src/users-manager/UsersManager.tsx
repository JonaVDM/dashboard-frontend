import { Card, Sizes, Color, Alert } from '../components/components';
import { connect } from 'react-redux';
import { RootState } from '../redux/reducers';
import Dashboard from '../dashboard/Dashbaord';
import NewUser from './NewUser';
import React, { useState, useEffect } from 'react';
import UserList from './UserList';

interface Props {
  token: string,
}

function UsersManager({ token }: Props): JSX.Element {
  let [users, setUsers] = useState<User[]>([]);
  let [message, setMessage] = useState<string>();
  let [color, setColor] = useState<Color>(Color.Success);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, []);

  async function load() {
    let request = await fetch('/api/user', {
      headers: {
        'x-token': token,
      }
    });

    let data = await request.json();
    if (data.users) {
      setUsers(data.users);
    } else {
      setMessage(data.message);
    }
  }

  function onMessage(message: string) {
    setMessage(message);
    setColor(Color.Success);
  }

  function onError(messages: { key: string, message: string }[]) {
    let messageList: string[] = [];
    messages.forEach(({ key, message }) => messageList.push(`${key}: ${message}`));
    setMessage(messageList.join(', '));
    setColor(Color.Danger);
  }

  return (
    <Dashboard>
      <div className="grid">

        <Card size={Sizes.full}>
          <p className="h1">User Manger</p>
        </Card>

        {message && (
          <Alert color={color}>{message}</Alert>
        )}

        <Card size={Sizes.half}>
          <p className="h2 pad-bottom">New</p>
          <NewUser onError={onError} onMessage={onMessage} />
        </Card>

        <Card size={Sizes.half}>
          <p className="h3">Update</p>
        </Card>

        <Card size={Sizes.full}>
          <UserList users={users} />
        </Card>
      </div>
    </Dashboard>
  );
}

function mapState(state: RootState) {
  return {
    token: state.auth.token
  }
};

function mapDispatch(dispatch: any) {
  return {}
}

export default connect(mapState, mapDispatch)(UsersManager);
