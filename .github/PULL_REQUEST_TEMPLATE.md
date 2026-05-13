## Summary

## <!-- 1–3 bullets describing WHAT and WHY -->

-

## Type of change

<!-- Check exactly ONE -->

- [ ] Bug fix (`fix:`)
- [ ] New feature (`feat:`)
- [ ] Code refactoring (`refactor:`)
- [ ] Style / formatting (`style:`)
- [ ] Performance improvement (`perf:`)
- [ ] Documentation only (`docs:`)
- [ ] Maintenance / tooling (`chore:`)
- [ ] Breaking change (`feat!:` / `fix!:`)

## Changes

| File           | What changed |
| -------------- | ------------ |
| `path/to/file` | Description  |

## Test plan

- [ ] `yarn lint` passes without errors
- [ ] `yarn test` passes
- [ ] `yarn build` compiles without errors
- [ ] Manually verified the affected functionality in the browser

## Checklist

- [ ] Conventional commit format (`type(scope): description`)
- [ ] No `Co-Authored-By` trailers in commits
- [ ] No commented-out code left behind
- [ ] Accessibility: WCAG 2.1 AA not regressed
- [ ] i18n: new strings added to `src/locales/messages.ts` for both `es` and `en`
- [ ] Docs updated if public API or behavior changed

---

## Chain Context

<!-- Fill this section only for chained / stacked PRs. Delete if single PR. -->

| Field         | Value                                           |
| ------------- | ----------------------------------------------- |
| Chain         | <!-- feature or stack name -->                  |
| Tracker PR    | <!-- #NNN or "Not needed" -->                   |
| Position      | <!-- N of total -->                             |
| Base          | <!-- target branch -->                          |
| Depends on    | <!-- PR/issue/link or "None" -->                |
| Follow-up     | <!-- next PR or "None" -->                      |
| Review budget | <!-- changed lines --> / 400                    |
| Starts at     | <!-- branch or state this builds on -->         |
| Ends with     | <!-- standalone result delivered by this PR --> |

### Chain overview

```
main
 └── #NNN Previous PR
      └── 📍 #NNN This PR
           └── #NNN Next PR
```

### Scope

- **Includes:** <!-- focused unit -->
- **Excludes:** <!-- deferred work -->

### Autonomy

- [ ] CI is expected to pass for this PR branch
- [ ] This PR has one deliverable scope
- [ ] This PR can be rolled back without unrelated changes
- [ ] Tests, docs, or manual verification cover this unit
