import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useChangeTheme } from './components/UI/ThemeProvider';
import useTheme from '@material-ui/core/styles/useTheme';

const Theme: React.FC = () => {
    const theme = useTheme();
    const changeTheme = useChangeTheme();
    return (
        <div style={{ maxHeight: "8%" }}>
            <IconButton
                title="Toggle light/dark mode"
                onClick={() => changeTheme()}
            >
                {theme.palette.type === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
        </div>
    )
}

export default Theme;