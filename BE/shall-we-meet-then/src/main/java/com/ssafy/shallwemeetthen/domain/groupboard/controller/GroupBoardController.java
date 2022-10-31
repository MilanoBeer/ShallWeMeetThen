package com.ssafy.shallwemeetthen.domain.groupboard.controller;

import com.ssafy.shallwemeetthen.domain.groupboard.dto.AddArticleDto;
import com.ssafy.shallwemeetthen.domain.groupboard.dto.ArticleSearchCondition;
import com.ssafy.shallwemeetthen.domain.groupboard.service.GroupBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class GroupBoardController {

    private final GroupBoardService groupBoardService;

    @PostMapping
    public ResponseEntity<?> addArticle(@ModelAttribute AddArticleDto.Request dto) {
        try {
            return new ResponseEntity<>(groupBoardService.addGroupBoard(dto), HttpStatus.OK);
        } catch (IOException | IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.OK);
        }
    }

    @GetMapping
    public ResponseEntity<?> getArticles(@ModelAttribute ArticleSearchCondition condition) {
        return new ResponseEntity<>(groupBoardService.getArticles(condition), HttpStatus.OK);
    }

    @GetMapping("/{boardSeq}")
    public ResponseEntity<?> getArticle(@PathVariable Long boardSeq) {
        try {
            return new ResponseEntity<>(groupBoardService.getArticle(boardSeq), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
