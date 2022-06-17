import styled from "styled-components";

const Container = styled.div<{ darkMode: boolean, isSmall: boolean }>`
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 80px;
	padding: 30px;
	font-size: 24px;
	font-weight: 700;
	background-color: white;
	box-shadow: 0 7px 17px rgba(0,0,0,0.2);

	${({ darkMode }) => darkMode && `
		background-color: #202020;
		color: white;
		box-shadow: 0 7px 17px rgba(0,0,0,0.4);
	`}

	${({ isSmall }) => isSmall && `
		font-size: 18px;
		justify-content: space-between;
	`}
`;

const ToggleContainer = styled.div`
	position: fixed;
	right: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 10px;
	}
	& > span {
		font-size: 12px;
	}
`;
const Toggle = styled.div<{ isOn: boolean }>`
	width: 60px;
	height: 30px;
	border-radius: 15px;
	position: relative;
	transition: background-color 0.5s linear;
	background-color: ${({ isOn }) => isOn
		? `black`
		: `rgba(0,0,0,0.2)`
	};
	&::after {
		content: '';
		transition: left 0.5s linear, background-color 0.5s linear;
		position: absolute;
		left: ${({ isOn }) => isOn
			? `calc(100% - 26px)`
			: `calc(4px)`
		};
		top: 4px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background-color: ${({ isOn }) => isOn ? "#202020": "white"};
		cursor: pointer;
	}
`;

export default function Header({
	darkMode,
	toggleDarkMode,
	title,
	isSmall
}: {
	darkMode: boolean,
	toggleDarkMode: () => void,
	title: string,
	isSmall: boolean
}) {
	return (
		<Container
			darkMode={darkMode}
			isSmall={isSmall}>
			<span>{title}</span>
			<ToggleContainer onClick={toggleDarkMode}>
				<Toggle isOn={darkMode}/>
			</ToggleContainer>
		</Container>
	)
}