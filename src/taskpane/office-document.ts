/* global Word console */

import { Assertion, AssertionResult,Result } from "../common/services/article/models/ArticleResponse";
import { AcceptedTopRanks } from "./components/CopyInsert";

export const insertText = async (text: string) => {
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
};

export async function insertObjectIntoWordDetail(assertionResult: AssertionResult,acceptedAssertionScore: AcceptedTopRanks[]) {
  return Word.run(async (context) => {
    const doc = context.document;
    let content = '';
    content += `<br/><p style="font-size: 10pt;"><b>Created Date</b>: ${assertionResult.createdAt} </p>`;
    // content += `<p style="font-size: 10pt;"><b>Id</b>: ${assertionResult.id} </p>`;
    content += `<span style="font-size: 10pt;"><b>Article</b>: ${assertionResult.article} </span>`;
    assertionResult.assertions.forEach((assertion, index) => {
      content = createTopRanks(content, index, assertion, acceptedAssertionScore);
    });
    const selection = doc.getSelection();
    selection.insertHtml(content, Word.InsertLocation.replace);
    doc.body.insertBreak(Word.BreakType.page, Word.InsertLocation.end);
    await context.sync();
  });
}


function createTopRanks(content: string, index: number, assertion: Assertion, acceptedAssertionScore: AcceptedTopRanks[]) {
  content += `<br/><p style="font-size: 10pt;"><b>Assertion</b>: ${index + 1}</p>`;
  // content += `<br/><p style="font-size: 10pt;"><b>Assertion Id</b>: ${assertion.id}</p>`;
      content += `<p style="font-size: 10pt;"><b>Article Name</b>: ${assertion.articleName} </p>`;

      // Insert topRanks as a table
      content += `<b>Top Ranks</b>:<br>`;
  content += '<table id="assertTable" border="1" style="width:100%">';
      content += '<tr style="width:30px;" valign: "center">';
      content += '<th style="width:6%;" valign: "center">Source</th>';
  content += '<th style="width:82%;"  valign: "center" >Excerpt</th>';
      content += '<th style="width:6%;"  valign: "center">Score</th>';
  content += '<th style="width:6%;"  valign: "center">Accept</th>';
      content += '</tr>';
  const excerptList = acceptedAssertionScore.filter(a => a.assertionId === assertion.id);
      assertion.topRanks.forEach((result) => {
        content += '<tr>';
        content += `<td style="font-size: 8pt; text-align:center"><a href=${result.source}>link</a></a></td>`;
        content += `<td style="font-size: 8pt;">${result.excerpt}</td>`;
        content += `<td style="font-size: 8pt;">${result.score && result.score.toFixed(4)}</td>`;
    result.accept=false;
    if (excerptList && excerptList.length > 0) {
      const topRankExcerpt = excerptList.filter(b => b.excerpt === result.excerpt);
      if (topRankExcerpt && topRankExcerpt.length > 0) {
        result.accept=true;    
      } else {
        result.accept=false;
      }   
    }
    content += `<td style="font-size: 8pt;">${result.accept && result.accept}</td>`;
        content += '</tr>';
      });
      content += '</table><br>';
  return content;
}

export async function insertObjectIntoWord(assertionResult: AssertionResult,acceptedAssertionScore: AcceptedTopRanks[],selectedValue:any) {
  return Word.run(async (context) => {
    const doc = context.document;
    // for(let i=assertionResult.assertions.length-1; i>=0 ;i--){
    //   const selection = doc.getSelection();
    //   let assert=assertionResult.assertions[i]
    //   selection.insertHtml(assert.articleName, Word.InsertLocation.end ); 
    //   doc.getSelection().insertEndnote(assert.id);  
    //   doc.getSelection().insertComment(assert.articleName);  
    // }
    //let filteredAssertions = assertionResult.assertions.filter(a=>acceptedAssertionScore.some(b=>b.assertionId==a.articleId))[0];
    let filteredAssertions = assertionResult.assertions.filter(a=>a.articleId==selectedValue)[0];
    let topRanks=filteredAssertions.topRanks.filter(a=> acceptedAssertionScore.some(b=>b.excerpt==a.excerpt));
    if(topRanks.length==0) return;
    let articleName=filteredAssertions.articleName+'<br/>';
    const selection = doc.getSelection();
    selection.insertHtml(articleName, Word.InsertLocation.end ); 
    topRanks.forEach(note=>{
      doc.getSelection().insertFootnote('Source: '+note.source);  
    })
    
    
   // const endnoteBody = doc.getEndnoteBody();
    // context.load(endnoteBody, 'endnotes');
    // await context.sync();      
    // let i=0;
    // endnoteBody.endnotes.items.forEach(async note => {
    //   context.load(note, 'range');      
    //   const endnoteRange = note.body.getRange();
    //   let content=''         
    //   //const assert = assertionResult.assertions[i];
    //   //content = createSelectedTopRanks(content, topRanks);          
    //   //endnoteRange.insertHtml(content, Word.InsertLocation.end);
    //   i++
    //   await context.sync();       
    // });
  });

  function createSelectedTopRanks(content: string, topRanks: Result[]) {
    // content += `<br/><p style="font-size: 10pt;"><b>Assertion Id</b>: ${assertion.id}</p>`;
  
        // Insert topRanks as a table
        content += '<table id="assertTable" border="0" style="width:100%">';
        topRanks.forEach((result) => {
          content += '<tr>';
          content += `<td style="font-size: 8pt; text-align:left">Source:<a href=${result.source}>${result.source}</a></a></td>`;
          content += `<td style="font-size: 8pt;text-align:left">Score:${result.score && result.score.toFixed(4)}</td>`;      
          content += '</tr>';
        });
        content += '</table><br>';
    return content;
  }

}
