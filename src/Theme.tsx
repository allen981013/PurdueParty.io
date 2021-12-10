import React from 'react';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useChangeTheme } from './components/UI/ThemeProvider';
import useTheme from '@material-ui/core/styles/useTheme';
import { Button } from '@material-ui/core';

const Theme: React.FC = () => {
    const theme = useTheme();
    const changeTheme = useChangeTheme();
    return (
        <div>
            <Button
                title="Toggle light/dark mode"
                onClick={() => changeTheme()}
            >
                {theme.palette.type === 'light' ? "Change to Dark Mode" : "Change to Light Mode"}
            </Button>
        </div >
    )
}

export default Theme;