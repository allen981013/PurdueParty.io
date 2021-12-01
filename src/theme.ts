import theme from 'styled-theming';

export const backgroundColor: theme.ThemeSet = theme('mode', {
    light: '#fafafa',
    dark: '#0e0f11'
});

export const textColor: theme.ThemeSet = theme('mode', {
    light: '#191919',
    dark: '#fafafa'
});

export const buttonBackgroundColor = theme('mode', {
    light: '#fafafa',
    dark: '#0e0f11'
});

export const buttonTextColor = theme('mode', {
    light: '#191919',
    dark: '#fafafa'
});