import React from 'react';
import {
    BoardContainer,
    Note,
    GridNote,
    LinedNote,
    TornNote,
    PostcardNote
} from '../../components/Memo/styles';

export const SeniorBoard = () => {
    return (
        <BoardContainer>
            <GridNote bgColor="#e8f5e9">Test1</GridNote>
            <LinedNote bgColor="#fff9c4">Test2</LinedNote>
            <LinedNote bgColor="#bbdefb">Test3</LinedNote>
            <TornNote bgColor="#e0f2f1">Test4</TornNote>
            <Note bgColor="#ffccbc">Test5</Note>
            <TornNote bgColor="#e6ee9c">Test6</TornNote>
            <PostcardNote bgColor="#ffffff"></PostcardNote>
            <Note bgColor="#f8bbd0">Test8</Note>
        </BoardContainer>
    );
};